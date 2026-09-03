// ============================================================
// BUSINESS PRO BARBER TEMPLATE
// SHOP CONFIGURATION
//
// This is the main file we customize for each barbershop.
// ============================================================

window.SHOP_CONFIG = {


  // ==========================================================
  // SHOP INFORMATION
  // ==========================================================

  shop: {

    name: "The Village Barber",

    pageTitle:
      "The Village Barber | Sanford, Maine",

    heroTitle:
      "LOOK SHARP. FEEL SHARP.",

    heroSubtitle:
      "Classic cuts. Modern styles. Your barber. Your time.",

    heroImage:
      "images/village-barber.jpg",

    addressLine1:
      "751 Main Street, Suite A",

    addressLine2:
      "Sanford, Maine 04073",

    phoneDisplay:
      "(207) 849-0126",

    phoneLink:
      "2078490126",

    hours: [

      {
        days: "Monday - Friday",
        hours: "9:00 AM - 5:00 PM"
      },

      {
        days: "Saturday",
        hours: "9:00 AM - 5:00 PM"
      },

      {
        days: "Sunday",
        hours: "Closed"
      }

    ]

  },


  // ==========================================================
  // SERVICES
  // ==========================================================

  services: [

    {
      id: "haircut",
      name: "Haircut",
      price: 30
    },

    {
      id: "beard-trim",
      name: "Beard Trim",
      price: 18
    },

    {
      id: "haircut-beard",
      name: "Haircut + Beard",
      price: 42
    },

    {
      id: "kids-cut",
      name: "Kids Cut",
      price: 25
    }

  ],


  // ==========================================================
  // BOOKING SETTINGS
  // ==========================================================

  booking: {

    appointmentLengthMinutes: 30,

    daysAvailableInAdvance: 365,

    storageKey:
      "businessProBarberBookings"

  },


  // ==========================================================
  // SMS SETTINGS
  // ==========================================================

  sms: {

    serverUrl:
      "https://village-barber-sms.onrender.com/send-confirmation",

    privacyUrl:
      "https://village-barber-sms.onrender.com/privacy",

    termsUrl:
      "https://village-barber-sms.onrender.com/terms"

  },


  // ==========================================================
  // BARBERS
  // ==========================================================

  barbers: [


    // ========================================================
    // JOE
    // ========================================================

    {

      id: "joe",

      name: "Joe",

      profilePhoto: "",

      cardSpecialty:
        "Fades & Classic Cuts",

      specialties: [
        "Classic Cuts",
        "Fades",
        "Beard Trims"
      ],

      bio:
        "Classic barbering with clean cuts, sharp fades, and attention to detail.",

      serviceIds: [
        "haircut",
        "beard-trim",
        "haircut-beard",
        "kids-cut"
      ],

      gallery: [

        {
          image: "images/demo-cut-1.jpg",
          caption: "Fresh Fade"
        },

        {
          image: "images/demo-cut-2.jpg",
          caption: "Clean Cut"
        }

      ],

      demoUploadEnabled: true,

      schedule: {

        workingDays: [
          1,
          2,
          3,
          4,
          5,
          6
        ],

        startTime:
          "09:00",

        endTime:
          "17:00",

        breaks: [

          {
            start: "12:00",
            end: "13:00"
          }

        ]

      }

    },


    // ========================================================
    // TOM - TEMPORARY DEMO BARBER
    // ========================================================

    {

      id: "tom",

      name: "Tom",

      profilePhoto:
        "images/tom.jpg",

      cardSpecialty:
        "Beards & Modern Styles",

      specialties: [
        "Modern Cuts",
        "Beard Styling",
        "Fades"
      ],

      bio:
        "Modern barbering, clean fades, beard work, and sharp finished styles.",

      serviceIds: [
        "haircut",
        "beard-trim",
        "haircut-beard"
      ],

      gallery: [],

      schedule: {

        workingDays: [
          1,
          2,
          3,
          4,
          5,
          6
        ],

        startTime:
          "09:00",

        endTime:
          "17:00",

        breaks: [

          {
            start: "12:00",
            end: "13:00"
          }

        ]

      }

    }

  ]

};