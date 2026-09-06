document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // BUSINESS PRO BARBER TEMPLATE
  // CUSTOMER WEBSITE ENGINE
  // ============================================================

  const config = window.SHOP_CONFIG;

    if (!config) {
    console.error(
      "SHOP_CONFIG was not found. Make sure shop-config.js loads before script.js."
    );
    return;
  }

  const shop = config.shop || {};
  const services = config.services || [];
  const barbers = config.barbers || [];
  const bookingSettings = config.booking || {};
  const smsSettings = config.sms || {};

  const APPOINTMENT_LENGTH =
    bookingSettings.appointmentLengthMinutes || 30;

  const DAYS_AVAILABLE =
    bookingSettings.daysAvailableInAdvance || 365;

  const STORAGE_KEY =
    bookingSettings.storageKey ||
    "businessProBarberBookings";

  const SMS_SERVER_URL =
    smsSettings.serverUrl || "";

  const BARBER_PHOTO_DB_NAME =
    "businessProBarberDemoUploads";

  const BARBER_PHOTO_STORE_NAME =
    "barberPhotos";


  // ============================================================
  // PAGE ELEMENTS
  // ============================================================

  const shopName =
    document.getElementById("shop-name");

  const hero =
    document.getElementById("home");

  const heroTitle =
    document.getElementById("hero-title");

  const heroSubtitle =
    document.getElementById("hero-subtitle");

  const servicesList =
    document.getElementById("services-list");

  const barberSelector =
    document.getElementById("barber-selector");

  const shopAddressLine1 =
    document.getElementById("shop-address-line1");

  const shopAddressLine2 =
    document.getElementById("shop-address-line2");

  const shopPhoneLink =
    document.getElementById("shop-phone-link");

  const shopHours =
    document.getElementById("shop-hours");

  const footerShopName =
    document.getElementById("footer-shop-name");


  // ============================================================
  // BARBER PROFILE POPUP
  // ============================================================

  const barberProfileModal =
    document.getElementById("barber-profile-modal");

  const barberProfileContent =
    document.getElementById("barber-profile-content");

  const closeBarberProfileButton =
    document.getElementById("close-barber-profile");


  // ============================================================
  // BOOKING POPUP
  // ============================================================

  const bookingModal =
    document.getElementById("booking-modal");

  const closeBookingButton =
    document.getElementById("close-booking");

  const barberSelect =
    document.getElementById("barber-select");

  const barberSelectLabel =
    document.querySelector('label[for="barber-select"]');

  const selectedBarberDisplay =
    document.getElementById("selected-barber");

  const serviceSelect =
    document.getElementById("service");

  const dateInput =
    document.getElementById("appointment-date");

  const timeSelect =
    document.getElementById("appointment-time");

  const nameInput =
    document.getElementById("customer-name");

  const phoneInput =
    document.getElementById("customer-phone");

  const smsConsent =
    document.getElementById("sms-consent");

  const confirmButton =
    document.getElementById("confirm-booking");

  const confirmationMessage =
    document.getElementById("confirmation-message");


  let selectedBarberId = "";


  // ============================================================
  // START WEBSITE
  // ============================================================

  buildShopInformation();
  buildServices();
  buildBarberCards();
  buildBarberSelect();
  configureBookingCalendar();
  configurePolicyLinks();
  attachGeneralBookingButtons();


  // ============================================================
  // SHOP INFORMATION
  // ============================================================

  function buildShopInformation() {

    document.title =
      shop.pageTitle ||
      shop.name ||
      "Business Pro Barber Demo";


    if (shopName) {
      shopName.textContent =
        shop.name || "BARBER SHOP";
    }


    if (heroTitle) {
      heroTitle.textContent =
        shop.heroTitle ||
        "LOOK SHARP. FEEL SHARP.";
    }


    if (heroSubtitle) {
      heroSubtitle.textContent =
        shop.heroSubtitle || "";
    }


    if (hero && shop.heroImage) {

      hero.style.backgroundImage = `
        linear-gradient(
          rgba(0, 0, 0, 0.40),
          rgba(0, 0, 0, 0.40)
        ),
        url("${shop.heroImage}")
      `;

    }


    if (shopAddressLine1) {
      shopAddressLine1.textContent =
        shop.addressLine1 || "";
    }


    if (shopAddressLine2) {
      shopAddressLine2.textContent =
        shop.addressLine2 || "";
    }


    if (shopPhoneLink) {

      shopPhoneLink.textContent =
        shop.phoneDisplay || "";

      shopPhoneLink.href =
        shop.phoneLink
          ? `tel:${shop.phoneLink}`
          : "#";

    }


    if (footerShopName) {
      footerShopName.textContent =
        shop.name || "Barber Shop";
    }


    buildHours();

  }


  // ============================================================
  // SHOP HOURS
  // ============================================================

  function buildHours() {

    if (!shopHours) {
      return;
    }


    shopHours.innerHTML = "";


    if (
      !Array.isArray(shop.hours) ||
      shop.hours.length === 0
    ) {
      return;
    }


    const heading =
      document.createElement("h3");

    heading.textContent =
      "Hours";

    shopHours.appendChild(heading);


    shop.hours.forEach(item => {

      const row =
        document.createElement("p");

      row.innerHTML = `
        <strong>${escapeHTML(item.days)}</strong>:
        ${escapeHTML(item.hours)}
      `;

      shopHours.appendChild(row);

    });

  }


  // ============================================================
  // SERVICES
  // ============================================================

  function buildServices() {

  if (!servicesList) {
    return;
  }

  servicesList.innerHTML = "";

  services.forEach(service => {

    const card =
      document.createElement("div");

    card.className =
      "service-card";

    card.setAttribute(
      "role",
      "button"
    );

    card.setAttribute(
      "tabindex",
      "0"
    );

    card.dataset.serviceId =
      service.id;

    card.innerHTML = `
      <div class="service-card-icon" data-service-icon="${escapeAttribute(service.id)}"></div>

      <h3>
        ${escapeHTML(service.name)}
      </h3>

      <p>
        ${formatPrice(service.price)}
      </p>

      <span class="service-card-arrow">
        ›
      </span>
    `;

    const openServiceBooking = () => {
      openBookingModal(
        "",
        service.id
      );
    };

    card.addEventListener(
      "click",
      openServiceBooking
    );

    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openServiceBooking();
        }

      }
    );

    servicesList.appendChild(card);

  });

}


  // ============================================================
  // SMALL BARBER CARDS
  // ============================================================

  function buildBarberCards() {

    if (!barberSelector) {
      return;
    }


    barberSelector.innerHTML = "";


    if (barbers.length === 0) {

      barberSelector.innerHTML =
        "<p>No barbers have been added yet.</p>";

      return;

    }


    barbers.forEach(barber => {

      const card =
        document.createElement("button");

      card.type =
        "button";

      card.className =
        "barber-selector-card";

      card.dataset.barberId =
        barber.id;


      const specialty =
        barber.cardSpecialty
          ? `
              <p class="barber-card-specialty">
                ${escapeHTML(barber.cardSpecialty)}
              </p>
            `
          : "";


      card.innerHTML = `

        ${buildProfilePhoto(barber, "small")}

        <h3>
          ${escapeHTML(barber.name)}
        </h3>

        ${specialty}

      `;


      card.addEventListener(
        "click",
        () => {

          openBarberProfile(
            barber.id
          );

        }
      );


      barberSelector.appendChild(card);

    });

  }


  // ============================================================
  // OPEN INDIVIDUAL BARBER PROFILE
  // ============================================================

  function openBarberProfile(
    barberId
  ) {

    const barber =
      getBarberById(barberId);


    if (!barber) {
      return;
    }


    const specialties =
      Array.isArray(barber.specialties)
        ? barber.specialties.join(" • ")
        : "";


    barberProfileContent.innerHTML = `

      <div class="barber-popup-profile">

        <div class="barber-popup-header">

          <div class="barber-popup-action">

            ${buildProfilePhoto(barber, "large")}

            <button
              type="button"
              class="book-button barber-popup-book-button"
              id="barber-popup-book-button"
            >
              Schedule Appointment
            </button>

          </div>

          <div class="barber-popup-info">

            <h2>
              ${escapeHTML(barber.name)}
            </h2>

            ${
              barber.cardSpecialty
                ? `
                    <p class="barber-popup-tagline">
                      ${escapeHTML(barber.cardSpecialty)}
                    </p>
                  `
                : ""
            }

            ${
              specialties
                ? `
                    <p class="barber-popup-specialties">
                      ${escapeHTML(specialties)}
                    </p>
                  `
                : ""
            }

            ${
              barber.bio
                ? `
                    <p class="barber-popup-bio">
                      ${escapeHTML(barber.bio)}
                    </p>
                  `
                : ""
            }

          </div>

        </div>


        <div class="barber-popup-work">

          <h3>
            ${escapeHTML(barber.name)}'s Work
          </h3>

          <div
            class="barber-gallery"
            id="gallery-${escapeAttribute(barber.id)}"
          >
          </div>

        </div>


      </div>

    `;


    buildBarberGallery(barber);


    const bookButton =
      document.getElementById(
        "barber-popup-book-button"
      );


    if (bookButton) {

      bookButton.addEventListener(
        "click",
        () => {

          closeBarberProfile(false);

          openBookingModal(
            barber.id
          );

        }
      );

    }


    barberProfileModal.classList.add(
      "open"
    );

    document.body.style.overflow =
      "hidden";

  }


  // ============================================================
  // BARBER GALLERY
  // ============================================================

  function buildBarberGallery(
    barber
  ) {

    const galleryElement =
      document.getElementById(
        `gallery-${barber.id}`
      );


    if (!galleryElement) {
      return;
    }


    galleryElement.innerHTML =
      "";


    const gallery =
      Array.isArray(barber.gallery)
        ? barber.gallery
        : [];


    gallery.forEach(photo => {

      const item =
        document.createElement("figure");

      item.className =
        "gallery-item";


      item.innerHTML = `

        <img
          src="${escapeAttribute(photo.image)}"
          alt="${escapeAttribute(
            photo.caption ||
            `${barber.name} haircut`
          )}"
          loading="lazy"
        >

        ${
          photo.caption
            ? `
                <figcaption>
                  ${escapeHTML(photo.caption)}
                </figcaption>
              `
            : ""
        }

      `;


      galleryElement.appendChild(item);

    });


    if (barber.demoUploadEnabled) {

      const uploadSlot =
        document.createElement("div");

      uploadSlot.className =
        "gallery-upload-slot";


      uploadSlot.innerHTML = `

        <input
          type="file"
          class="gallery-upload-input"
          accept="image/*"
          hidden
        >

        <div
          class="gallery-upload-empty"
          role="button"
          tabindex="0"
          aria-label="Upload a haircut photo for ${escapeAttribute(barber.name)}"
        >

          <span class="gallery-upload-plus">
            +
          </span>

          <strong>
            ${escapeHTML(barber.name)}, put your picture here
          </strong>

          <span>
            Tap to choose a photo
          </span>

          <small>
            Or drag and drop on a computer
          </small>

        </div>


        <div
          class="gallery-upload-preview"
          hidden
        >

          <img
            alt="${escapeAttribute(barber.name)} haircut photo"
          >

          <button
            type="button"
            class="gallery-replace-photo"
          >
            Replace Photo
          </button>

        </div>

      `;


      galleryElement.appendChild(
        uploadSlot
      );


      setupBarberPhotoUpload(
        barber,
        uploadSlot
      );


    } else if (gallery.length === 0) {

      galleryElement.innerHTML = `

        <div class="gallery-empty">

          <p>
            ${escapeHTML(barber.name)}'s haircut photos
            will appear here.
          </p>

        </div>

      `;

    }

  }


  // ============================================================
  // DEMO BARBER PHOTO UPLOAD
  // ============================================================

  function setupBarberPhotoUpload(
    barber,
    uploadSlot
  ) {

    const input =
      uploadSlot.querySelector(
        ".gallery-upload-input"
      );

    const emptyState =
      uploadSlot.querySelector(
        ".gallery-upload-empty"
      );

    const preview =
      uploadSlot.querySelector(
        ".gallery-upload-preview"
      );

    const previewImage =
      uploadSlot.querySelector(
        ".gallery-upload-preview img"
      );

    const replaceButton =
      uploadSlot.querySelector(
        ".gallery-replace-photo"
      );


    if (
      !input ||
      !emptyState ||
      !preview ||
      !previewImage ||
      !replaceButton
    ) {
      return;
    }


    const choosePhoto = () => {
      input.click();
    };


    emptyState.addEventListener(
      "click",
      choosePhoto
    );


    emptyState.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          choosePhoto();
        }

      }
    );


    replaceButton.addEventListener(
      "click",
      choosePhoto
    );


    input.addEventListener(
      "change",
      () => {

        const file =
          input.files &&
          input.files[0];

        if (file) {

          handleBarberPhotoFile(
            barber,
            uploadSlot,
            file
          );

        }

        input.value =
          "";

      }
    );


    [
      "dragenter",
      "dragover"
    ].forEach(eventName => {

      emptyState.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          emptyState.classList.add(
            "drag-over"
          );

        }
      );

    });


    [
      "dragleave",
      "drop"
    ].forEach(eventName => {

      emptyState.addEventListener(
        eventName,
        event => {

          event.preventDefault();

          emptyState.classList.remove(
            "drag-over"
          );

        }
      );

    });


    emptyState.addEventListener(
      "drop",
      event => {

        const file =
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0];

        if (file) {

          handleBarberPhotoFile(
            barber,
            uploadSlot,
            file
          );

        }

      }
    );


    loadSavedBarberPhoto(
      barber.id
    )
      .then(savedPhoto => {

        if (savedPhoto) {

          showBarberPhotoPreview(
            uploadSlot,
            savedPhoto
          );

        }

      })
      .catch(error => {

        console.warn(
          "Saved barber photo could not be loaded:",
          error
        );

      });

  }


  function handleBarberPhotoFile(
    barber,
    uploadSlot,
    file
  ) {

    if (
      !file ||
      !file.type ||
      !file.type.startsWith("image/")
    ) {

      window.alert(
        "Please choose an image file."
      );

      return;

    }


    const MAX_IMAGE_SIZE =
      12 * 1024 * 1024;


    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {

      window.alert(
        "Please choose an image smaller than 12 MB."
      );

      return;

    }


    showBarberPhotoPreview(
      uploadSlot,
      file
    );


    saveBarberPhoto(
      barber.id,
      file
    ).catch(error => {

      console.warn(
        "Barber photo could not be saved:",
        error
      );

    });

  }


  function showBarberPhotoPreview(
    uploadSlot,
    imageBlob
  ) {

    const emptyState =
      uploadSlot.querySelector(
        ".gallery-upload-empty"
      );

    const preview =
      uploadSlot.querySelector(
        ".gallery-upload-preview"
      );

    const previewImage =
      uploadSlot.querySelector(
        ".gallery-upload-preview img"
      );


    if (
      !emptyState ||
      !preview ||
      !previewImage
    ) {
      return;
    }


    if (
      previewImage.dataset.objectUrl
    ) {

      URL.revokeObjectURL(
        previewImage.dataset.objectUrl
      );

    }


    const objectUrl =
      URL.createObjectURL(
        imageBlob
      );


    previewImage.src =
      objectUrl;

    previewImage.dataset.objectUrl =
      objectUrl;

    emptyState.hidden =
      true;

    preview.hidden =
      false;

  }


  // ============================================================
  // INDEXEDDB PHOTO STORAGE
  // ============================================================

  function openBarberPhotoDatabase() {

    return new Promise(
      (resolve, reject) => {

        if (!window.indexedDB) {

          reject(
            new Error(
              "IndexedDB is not supported in this browser."
            )
          );

          return;

        }


        const request =
          indexedDB.open(
            BARBER_PHOTO_DB_NAME,
            1
          );


        request.onupgradeneeded =
          event => {

            const database =
              event.target.result;


            if (
              !database.objectStoreNames.contains(
                BARBER_PHOTO_STORE_NAME
              )
            ) {

              database.createObjectStore(
                BARBER_PHOTO_STORE_NAME,
                {
                  keyPath:
                    "barberId"
                }
              );

            }

          };


        request.onsuccess =
          () => {

            resolve(
              request.result
            );

          };


        request.onerror =
          () => {

            reject(
              request.error ||
              new Error(
                "The photo database could not be opened."
              )
            );

          };

      }
    );

  }


  async function saveBarberPhoto(
    barberId,
    imageBlob
  ) {

    const database =
      await openBarberPhotoDatabase();


    return new Promise(
      (resolve, reject) => {

        const transaction =
          database.transaction(
            BARBER_PHOTO_STORE_NAME,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            BARBER_PHOTO_STORE_NAME
          );


        store.put({

          barberId:
            barberId,

          imageBlob:
            imageBlob,

          updatedAt:
            Date.now()

        });


        transaction.oncomplete =
          () => {

            database.close();
            resolve();

          };


        transaction.onerror =
          () => {

            database.close();

            reject(
              transaction.error ||
              new Error(
                "The photo could not be saved."
              )
            );

          };


        transaction.onabort =
          () => {

            database.close();

            reject(
              transaction.error ||
              new Error(
                "Saving the photo was cancelled."
              )
            );

          };

      }
    );

  }


  async function loadSavedBarberPhoto(
    barberId
  ) {

    const database =
      await openBarberPhotoDatabase();


    return new Promise(
      (resolve, reject) => {

        const transaction =
          database.transaction(
            BARBER_PHOTO_STORE_NAME,
            "readonly"
          );

        const store =
          transaction.objectStore(
            BARBER_PHOTO_STORE_NAME
          );

        const request =
          store.get(
            barberId
          );


        request.onsuccess =
          () => {

            const record =
              request.result;

            database.close();

            resolve(
              record &&
              record.imageBlob
                ? record.imageBlob
                : null
            );

          };


        request.onerror =
          () => {

            database.close();

            reject(
              request.error ||
              new Error(
                "The saved photo could not be loaded."
              )
            );

          };

      }
    );

  }


  // ============================================================
  // CLOSE BARBER PROFILE
  // ============================================================

  closeBarberProfileButton.addEventListener(
    "click",
    () => {

      closeBarberProfile();

    }
  );


  barberProfileModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        barberProfileModal
      ) {

        closeBarberProfile();

      }

    }
  );


  function closeBarberProfile(
    restoreScroll = true
  ) {

    barberProfileModal.classList.remove(
      "open"
    );


    if (restoreScroll) {

      document.body.style.overflow =
        "";

    }

  }


  // ============================================================
  // PROFILE PHOTO OR INITIALS
  // ============================================================

  function buildProfilePhoto(
    barber,
    size
  ) {

    const className =
      size === "small"
        ? "barber-card-photo"
        : "barber-popup-photo";


    if (barber.profilePhoto) {

      return `

        <img
          class="${className}"
          src="${escapeAttribute(barber.profilePhoto)}"
          alt="${escapeAttribute(barber.name)}"
        >

      `;

    }


    return `

      <div
        class="${className} barber-photo-placeholder"
        aria-label="${escapeAttribute(barber.name)}"
      >

        ${escapeHTML(
          getInitials(
            barber.name
          )
        )}

      </div>

    `;

  }


  // ============================================================
  // BARBER BOOKING DROPDOWN
  // ============================================================

  function buildBarberSelect() {

    barberSelect.innerHTML = `
      <option value="">
        Select a barber
      </option>
    `;


    barbers.forEach(barber => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        barber.id;

      option.textContent =
        barber.name;

      barberSelect.appendChild(
        option
      );

    });

  }


  // ============================================================
  // GENERAL BOOKING BUTTONS
  // ============================================================

  function attachGeneralBookingButtons() {

    const buttons =
      document.querySelectorAll(
        ".open-booking"
      );


    buttons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openBookingModal(
            button.dataset.barber ||
            ""
          );

        }
      );

    });

  }


  // ============================================================
  // OPEN BOOKING
  // ============================================================

 function openBookingModal(
  requestedBarberId,
  requestedServiceId = ""
) {

  bookingModal.dataset.requestedServiceId =
    requestedServiceId;
  

    confirmationMessage.innerHTML =
      "";


    const requestedBarber =
      requestedBarberId
        ? getBarberById(
            requestedBarberId
          )
        : null;


    if (requestedBarber) {

      setBarberChoiceVisibility(
        false
      );

      selectBarber(
        requestedBarber.id
      );


    } else if (
      barbers.length === 1
    ) {

      setBarberChoiceVisibility(
        false
      );

      selectBarber(
        barbers[0].id
      );


    } else {

      setBarberChoiceVisibility(
        true
      );

      selectBarber("");

    }


    bookingModal.classList.add(
      "open"
    );

    document.body.style.overflow =
      "hidden";

  }


  function setBarberChoiceVisibility(
    showChoice
  ) {

    if (barberSelectLabel) {

      barberSelectLabel.hidden =
        !showChoice;

    }


    if (barberSelect) {

      barberSelect.hidden =
        !showChoice;

    }

  }


  // ============================================================
  // BARBER SELECTION INSIDE BOOKING
  // ============================================================

  barberSelect.addEventListener(
    "change",
    () => {

      selectBarber(
        barberSelect.value
      );

    }
  );


  function selectBarber(
    barberId
  ) {

    selectedBarberId =
      barberId;

    barberSelect.value =
      barberId;


    const barber =
      getBarberById(
        barberId
      );


    if (!barber) {

      selectedBarberDisplay.textContent =
        "Select a Barber";

      buildServiceSelect(
        null
      );

      resetTimeSelect();

      return;

    }


    selectedBarberDisplay.textContent =
      barber.name;


    buildServiceSelect(
      barber
    );
        const requestedServiceId =
      bookingModal.dataset.requestedServiceId || "";

    if (
      requestedServiceId &&
      Array.from(serviceSelect.options).some(
        option =>
          option.value === requestedServiceId
      )
    ) {
      serviceSelect.value =
        requestedServiceId;
    }


    updateAvailableTimes();

  }


  // ============================================================
  // BARBER SERVICES
  // ============================================================

  function buildServiceSelect(
    barber
  ) {

    serviceSelect.innerHTML = `
      <option value="">
        Select a service
      </option>
    `;


    if (!barber) {
      return;
    }


    const allowedIds =
      Array.isArray(
        barber.serviceIds
      )
        ? barber.serviceIds
        : [];


    services.forEach(service => {

      if (
        allowedIds.length > 0 &&
        !allowedIds.includes(
          service.id
        )
      ) {
        return;
      }


      const option =
        document.createElement(
          "option"
        );

      option.value =
        service.id;

      option.textContent =
        `${service.name} - ${formatPrice(service.price)}`;


      serviceSelect.appendChild(
        option
      );

    });

  }


  // ============================================================
  // CLOSE BOOKING
  // ============================================================

  closeBookingButton.addEventListener(
    "click",
    closeBookingModal
  );


  bookingModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        bookingModal
      ) {

        closeBookingModal();

      }

    }
  );


  function closeBookingModal() {

    bookingModal.classList.remove(
      "open"
    );

    document.body.style.overflow =
      "";

  }


  // ============================================================
  // ESCAPE KEY
  // ============================================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }


      if (
        bookingModal.classList.contains(
          "open"
        )
      ) {

        closeBookingModal();
        return;

      }


      if (
        barberProfileModal.classList.contains(
          "open"
        )
      ) {

        closeBarberProfile();

      }

    }
  );


  // ============================================================
  // BOOKING CALENDAR
  // ============================================================

  function configureBookingCalendar() {

    const today =
      new Date();


    dateInput.min =
      formatDateForInput(
        today
      );


    const finalDate =
      new Date();


    finalDate.setDate(
      finalDate.getDate() +
      DAYS_AVAILABLE
    );


    dateInput.max =
      formatDateForInput(
        finalDate
      );

  }


  dateInput.addEventListener(
    "change",
    updateAvailableTimes
  );


  // ============================================================
  // AVAILABLE TIMES
  // ============================================================

  function updateAvailableTimes() {

    resetTimeSelect();


    if (
      !selectedBarberId ||
      !dateInput.value
    ) {
      return;
    }


    const barber =
      getBarberById(
        selectedBarberId
      );


    if (
      !barber ||
      !barber.schedule
    ) {
      return;
    }


    const schedule =
      barber.schedule;


    const selectedDate =
      new Date(
        dateInput.value +
        "T12:00:00"
      );


    const dayOfWeek =
      selectedDate.getDay();


    const workingDays =
      schedule.workingDays ||
      [];


    if (
      !workingDays.includes(
        dayOfWeek
      )
    ) {

      addDisabledTimeOption(
        `${barber.name} is unavailable this day`
      );

      return;

    }


    const times =
      createTimeSlots(
        schedule.startTime,
        schedule.endTime,
        APPOINTMENT_LENGTH
      );


    const bookings =
      getBookings();


    times.forEach(time => {

      if (
        isDuringBreak(
          time,
          schedule.breaks ||
          []
        )
      ) {
        return;
      }


      if (
        isPastTimeToday(
          dateInput.value,
          time
        )
      ) {
        return;
      }


      const alreadyBooked =
        bookings.some(
          booking => {

            return (

              booking.barberId ===
                selectedBarberId &&

              booking.date ===
                dateInput.value &&

              booking.time ===
                time

            );

          }
        );


      if (!alreadyBooked) {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          time;

        option.textContent =
          convertTo12Hour(
            time
          );

        timeSelect.appendChild(
          option
        );

      }

    });


    if (
      timeSelect.options.length ===
      1
    ) {

      addDisabledTimeOption(
        "No appointments available"
      );

    }

  }


  function resetTimeSelect() {

    timeSelect.innerHTML = `
      <option value="">
        Select a time
      </option>
    `;

  }


  function addDisabledTimeOption(
    text
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.textContent =
      text;

    option.disabled =
      true;

    timeSelect.appendChild(
      option
    );

  }


  // ============================================================
  // TIME SLOTS
  // ============================================================

  function createTimeSlots(
    startTime,
    endTime,
    interval
  ) {

    const slots = [];


    let current =
      timeToMinutes(
        startTime
      );

    const end =
      timeToMinutes(
        endTime
      );


    while (
      current + interval <=
      end
    ) {

      slots.push(
        minutesToTime(
          current
        )
      );

      current +=
        interval;

    }


    return slots;

  }


  function isDuringBreak(
    time,
    breaks
  ) {

    const minutes =
      timeToMinutes(
        time
      );


    return breaks.some(
      breakTime => {

        const start =
          timeToMinutes(
            breakTime.start
          );

        const end =
          timeToMinutes(
            breakTime.end
          );


        return (
          minutes >= start &&
          minutes < end
        );

      }
    );

  }


  function isPastTimeToday(
    dateString,
    time
  ) {

    const today =
      formatDateForInput(
        new Date()
      );


    if (
      dateString !==
      today
    ) {
      return false;
    }


    const now =
      new Date();


    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();


    return (
      timeToMinutes(
        time
      ) <=
      currentMinutes
    );

  }


  // ============================================================
  // CONFIRM BOOKING
  // ============================================================

  confirmButton.addEventListener(
    "click",
    confirmAppointment
  );


  function confirmAppointment() {

    const barber =
      getBarberById(
        selectedBarberId
      );


    const service =
      getServiceById(
        serviceSelect.value
      );


    const date =
      dateInput.value;

    const time =
      timeSelect.value;

    const customerName =
      nameInput.value.trim();

    const phone =
      phoneInput.value.trim();

    const formattedPhone =
      formatUSPhone(
        phone
      );


    if (
      !barber ||
      !service ||
      !date ||
      !time ||
      !customerName ||
      !phone
    ) {

      showBookingError(
        "Please complete all appointment fields."
      );

      return;

    }


    if (!formattedPhone) {

      showBookingError(
        "Please enter a valid 10-digit US phone number."
      );

      return;

    }


    const bookings =
      getBookings();


    const slotTaken =
      bookings.some(
        booking => {

          return (

            booking.barberId ===
              barber.id &&

            booking.date ===
              date &&

            booking.time ===
              time

          );

        }
      );


    if (slotTaken) {

      showBookingError(
        "That appointment is no longer available. Please choose another time."
      );

      updateAvailableTimes();

      return;

    }


    const booking = {

      id:
        Date.now().toString(),

      shopName:
        shop.name,

      barberId:
        barber.id,

      barberName:
        barber.name,

      serviceId:
        service.id,

      serviceName:
        service.name,

      servicePrice:
        service.price,

      date:
        date,

      time:
        time,

      customerName:
        customerName,

      phone:
        formattedPhone,

      smsConsent:
        smsConsent.checked

    };


    bookings.push(
      booking
    );

    saveBookings(
      bookings
    );

    showConfirmation(
      booking
    );

    updateAvailableTimes();


    if (
      booking.smsConsent
    ) {

      sendConfirmationText(
        booking
      );

    }


    // Automatically close the booking popup
    // after the customer sees the confirmation.
    window.setTimeout(
      () => {

        closeBookingModal();

      },
      2000
    );

  }


  function showBookingError(
    message
  ) {

    confirmationMessage.innerHTML = `
      <p class="booking-error">
        ${escapeHTML(message)}
      </p>
    `;

  }


  // ============================================================
  // CONFIRMATION
  // ============================================================

  function showConfirmation(
    booking
  ) {

    const displayDate =
      formatDisplayDate(
        booking.date
      );


    const displayTime =
      convertTo12Hour(
        booking.time
      );


    const endTime =
      addMinutes(
        booking.time,
        APPOINTMENT_LENGTH
      );


    const smsStatus =
      booking.smsConsent
        ? `
            <p
              class="sms-demo-message"
              id="sms-status-${booking.id}"
            >
              Sending confirmation text...
            </p>
          `
        : `
            <p class="sms-demo-message">
              SMS notifications were not selected.
              Your appointment is still confirmed.
            </p>
          `;


    confirmationMessage.innerHTML = `

      <div class="booking-confirmed">

        <h3>
          Appointment Confirmed ✓
        </h3>

        <p>
          <strong>
            ${escapeHTML(booking.customerName)}
          </strong>,
          you're booked with
          <strong>
            ${escapeHTML(booking.barberName)}
          </strong>.
        </p>

        <p>
          <strong>Service:</strong>
          ${escapeHTML(booking.serviceName)}
          -
          ${formatPrice(booking.servicePrice)}
        </p>

        <p>
          <strong>Date:</strong>
          ${displayDate}
        </p>

        <p>
          <strong>Time:</strong>
          ${displayTime}
          -
          ${convertTo12Hour(endTime)}
        </p>

        <p>
          <strong>Confirmation #:</strong>
          ${booking.id.slice(-6)}
        </p>

        ${smsStatus}

        <button
          type="button"
          class="cancel-appointment"
          data-booking-id="${booking.id}"
        >
          Cancel Appointment
        </button>

      </div>

    `;


    const cancelButton =
      confirmationMessage.querySelector(
        ".cancel-appointment"
      );


    if (cancelButton) {

      cancelButton.addEventListener(
        "click",
        () => {

          cancelAppointment(
            booking.id
          );

        }
      );

    }

  }


  // ============================================================
  // SMS
  // ============================================================

  async function sendConfirmationText(
    booking
  ) {

    const status =
      document.getElementById(
        `sms-status-${booking.id}`
      );


    if (!SMS_SERVER_URL) {

      if (status) {

        status.textContent =
          "Appointment confirmed. SMS service is not configured.";

      }

      return;

    }


    try {

      const response =
        await fetch(
          SMS_SERVER_URL,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({

                shopName:
                  booking.shopName ||
                  shop.name ||
                  "Barber Shop",

                phone:
                  booking.phone,

                barber:
                  booking.barberName,

                service:
                  booking.serviceName,

                date:
                  booking.date,

                time:
                  booking.time,

                customerName:
                  booking.customerName

              })

          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          "Text message could not be sent."
        );

      }


      if (status) {

        status.textContent =
          "✓ Confirmation text sent to your phone.";

      }


    } catch (error) {

      console.error(
        "SMS confirmation error:",
        error
      );


      if (status) {

        status.textContent =
          "Appointment saved, but the confirmation text could not be sent.";

      }

    }

  }


  // ============================================================
  // CANCEL BOOKING
  // ============================================================

  function cancelAppointment(
    bookingId
  ) {

    const bookings =
      getBookings();


    const booking =
      bookings.find(
        item =>
          item.id ===
          bookingId
      );


    const updatedBookings =
      bookings.filter(
        item =>
          item.id !==
          bookingId
      );


    saveBookings(
      updatedBookings
    );


    if (booking) {

      confirmationMessage.innerHTML = `

        <div class="booking-cancelled">

          <h3>
            Appointment Cancelled
          </h3>

          <p>
            Your appointment with
            <strong>
              ${escapeHTML(booking.barberName)}
            </strong>
            has been cancelled.
          </p>

          <p>
            ${formatDisplayDate(booking.date)}
            at
            ${convertTo12Hour(booking.time)}
            is now available again.
          </p>

        </div>

      `;

    }


    updateAvailableTimes();

  }


  // ============================================================
  // STORAGE
  // ============================================================

  function getBookings() {

    try {

      return JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        )
      ) || [];


    } catch {

      return [];

    }

  }


  function saveBookings(
    bookings
  ) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        bookings
      )
    );

  }


  // ============================================================
  // LOOKUPS
  // ============================================================

  function getBarberById(
    barberId
  ) {

    return barbers.find(
      barber =>
        barber.id ===
        barberId
    ) || null;

  }


  function getServiceById(
    serviceId
  ) {

    return services.find(
      service =>
        service.id ===
        serviceId
    ) || null;

  }


  // ============================================================
  // PRIVACY LINKS
  // ============================================================

  function configurePolicyLinks() {

    const links =
      document.querySelectorAll(
        ".sms-policy-links a"
      );


    if (
      links[0] &&
      smsSettings.privacyUrl
    ) {

      links[0].href =
        smsSettings.privacyUrl;

    }


    if (
      links[1] &&
      smsSettings.termsUrl
    ) {

      links[1].href =
        smsSettings.termsUrl;

    }

  }


  // ============================================================
  // INITIALS
  // ============================================================

  function getInitials(
    name
  ) {

    return String(
      name || ""
    )
      .trim()
      .split(/\s+/)
      .map(
        part =>
          part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  }


  // ============================================================
  // PHONE
  // ============================================================

  function formatUSPhone(
    phone
  ) {

    const digits =
      String(
        phone || ""
      )
        .replace(
          /\D/g,
          ""
        );


    if (
      digits.length ===
      10
    ) {

      return `+1${digits}`;

    }


    if (
      digits.length ===
        11 &&
      digits.startsWith(
        "1"
      )
    ) {

      return `+${digits}`;

    }


    return null;

  }


  // ============================================================
  // PRICE
  // ============================================================

  function formatPrice(
    price
  ) {

    const number =
      Number(
        price
      );


    if (
      Number.isNaN(
        number
      )
    ) {

      return "";

    }


    if (
      Number.isInteger(
        number
      )
    ) {

      return `$${number}`;

    }


    return `$${number.toFixed(2)}`;

  }


  // ============================================================
  // TIME
  // ============================================================

  function timeToMinutes(
    time
  ) {

    const parts =
      time.split(
        ":"
      );


    return (

      Number(parts[0]) *
        60 +

      Number(parts[1])

    );

  }


  function minutesToTime(
    minutes
  ) {

    const hours =
      Math.floor(
        minutes /
        60
      );

    const mins =
      minutes %
      60;


    return (

      String(hours)
        .padStart(
          2,
          "0"
        ) +

      ":" +

      String(mins)
        .padStart(
          2,
          "0"
        )

    );

  }


  function addMinutes(
    time,
    minutes
  ) {

    return minutesToTime(

      timeToMinutes(
        time
      ) +

      minutes

    );

  }


  function convertTo12Hour(
    time
  ) {

    const parts =
      time.split(
        ":"
      );


    let hour =
      Number(
        parts[0]
      );


    const minutes =
      parts[1];


    const period =
      hour >= 12
        ? "PM"
        : "AM";


    hour =
      hour %
      12;


    if (
      hour ===
      0
    ) {

      hour =
        12;

    }


    return `${hour}:${minutes} ${period}`;

  }


  // ============================================================
  // DATE
  // ============================================================

  function formatDateForInput(
    date
  ) {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() +
        1
      )
        .padStart(
          2,
          "0"
        );


    const day =
      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        );


    return `${year}-${month}-${day}`;

  }


  function formatDisplayDate(
    dateString
  ) {

    const date =
      new Date(

        dateString +
        "T12:00:00"

      );


    return date.toLocaleDateString(
      "en-US",
      {

        weekday:
          "long",

        month:
          "long",

        day:
          "numeric",

        year:
          "numeric"

      }
    );

  }


  // ============================================================
  // TEXT SAFETY
  // ============================================================

  function escapeHTML(
    text
  ) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      String(
        text ?? ""
      );


    return div.innerHTML;

  }


  function escapeAttribute(
    text
  ) {

    return escapeHTML(
      text
    );

  }

});
