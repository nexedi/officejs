/*global window, jQuery, rJS */
"use strict";
(function (window, $, rJS, undefined) {

  $.mobile.ajaxEnabled = false;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;

  rJS(window).ready(function () {
    var g = rJS(this),
      body = g.context,
      main_context = g.context.find('.ui-content').first(),
      ioGadgetConfig = {"type": "local",
                        "username": "officejs",
                        "application_name": "officejs"
                       },
      jioGadget,
      jqsGadget;

    function log(x) {
      console.log(x);
    }

    function setTitle(title) {
      g.context.find("#headergadget").find("h1").text(title);
      return $('title').text("OfficeJS | " + title);
    }

    function enhanceGadgetRendering(gadget) {
      gadget.context.enhanceWithin();
      return gadget.getTitle()
        .then(setTitle);
    }

    function registerSaveButton(gadget) {
      window.jqs = gadget;
      $("#save-doc").click(function () {
        var fileName = $("#iogadget input").val();
        jioGadget.configureIO(ioGadgetConfig, fileName)
          .then(gadget.get)
          .then(function (o) {jioGadget.setIO(o); });
      });
      return gadget;
    }

    function registerLoadButton(gadget) {
      $("#load-doc").click(function () {
        var fileName = $("#iogadget input").val();
        jioGadget.configureIO(ioGadgetConfig, fileName)
          .then(jioGadget.getIO)
          .then(gadget.put);
      });
      return gadget;
    }

    function registerCleanButton(gadget) {
      $("#new-doc").click(function () {
        gadget.clean();
      });
    }

    function initializeRoute() {
      body
        .route("add", "", 1)
        .done(function () {
          $.url.redirect('/login/');
        });

      body
        .route("add", "/about/", 1)
        .done(function () {
          g.declareGadget('./about.html', main_context)
            .then(enhanceGadgetRendering);
        });

      body
        .route("add", "/contact/", 1)
        .done(function () {
          g.declareGadget('./contact.html', main_context)
            .then(enhanceGadgetRendering);
        });

      body
        .route("add", "/login/", 1)
        .done(function () {
          g.declareGadget('./login.html', main_context)
            .then(enhanceGadgetRendering);
        });

      body
        .route("add", "/spreadsheet/", 1)
        .done(function () {
          g.declareIframedGadget('./spreadsheet.html', main_context)
            .then(registerSaveButton)
            .then(registerLoadButton)
            .then(registerCleanButton);
        });
    }

    g.declareGadget('./io.html', g.context.find("#iogadget"))
      .done(function (ioGadget) {
        window.jio = ioGadget;
        jioGadget = ioGadget;
        // Trigger route change
        initializeRoute();
        $.url.onhashchange(function () {
          body.route("go", $.url.getPath())
            .fail(function () {
              g.declareGadget('./error.html', main_context)
                .then(enhanceGadgetRendering)
                .then(initializeRoute);
            });
        });
      });
  });

}(window, jQuery, rJS));
