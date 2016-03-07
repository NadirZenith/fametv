/* jqBootstrapValidation
 * A plugin for automating validation on Twitter Bootstrap formatted forms.
 *
 * v1.3.6
 *
 * License: MIT <http://opensource.org/licenses/mit-license.php> - see LICENSE file
 *
 * http://ReactiveRaven.github.com/jqBootstrapValidation/
 */

(function( $ ){

	var createdElements = [];

	var defaults = {
		options: {
			prependExistingHelpBlock: false,
			sniffHtml: true, // sniff for 'required', 'maxlength', etc
			preventSubmit: true, // stop the form submit event from firing if validation fails
			submitError: false, // function called if there is an error when trying to submit
			submitSuccess: false, // function called just before a successful submit event is sent to the server
            semanticallyStrict: false, // set to true to tidy up generated HTML output
			autoAdd: {
				helpBlocks: true
			},
            filter: function () {
                // return $(this).is(":visible"); // only validate elements you can see
                return true; // validate everything
            }
		},
    methods: {
      init : function( options ) {

        var settings = $.extend(true, {}, defaults);

        settings.options = $.extend(true, settings.options, options);

        var $siblingElements = this;

        var uniqueForms = $.unique(
          $siblingElements.map( function () {
            return $(this).parents("form")[0];
          }).toArray()
        );

        $(uniqueForms).bind("submit", function (e) {
          var $form = $(this);
          var warningsFound = 0;
          var $inputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          $inputs.trigger("submit.validation").trigger("validationLostFocus.validation");

          $inputs.each(function (i, el) {
            var $this = $(el),
              $controlGroup = $this.parents(".control-group").first();
            if (
              $controlGroup.hasClass("warning")
            ) {
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });

          $inputs.trigger("validationLostFocus.validation");

          if (warningsFound) {
            if (settings.options.preventSubmit) {
              e.preventDefault();
            }
            $form.addClass("error");
            if ($.isFunction(settings.options.submitError)) {
              settings.options.submitError($form, e, $inputs.jqBootstrapValidation("collectErrors", true));
            }
          } else {
            $form.removeClass("error");
            if ($.isFunction(settings.options.submitSuccess)) {
              settings.options.submitSuccess($form, e);
            }
          }
        });

        return this.each(function(){

          // Get references to everything we're interested in
          var $this = $(this),
            $controlGroup = $this.parents(".control-group").first(),
            $helpBlock = $controlGroup.find(".help-block").first(),
            $form = $this.parents("form").first(),
            validatorNames = [];

          // create message container if not exists
          if (!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks) {
              $helpBlock = $('<div class="help-block" />');
              $controlGroup.find('.controls').append($helpBlock);
							createdElements.push($helpBlock[0]);
          }

          // =============================================================
          //                                     SNIFF HTML FOR VALIDATORS
          // =============================================================

          // *snort sniff snuffle*

          if (settings.options.sniffHtml) {
            var message = "";
            // ---------------------------------------------------------
            //                                                   PATTERN
            // ---------------------------------------------------------
            if ($this.attr("pattern") !== undefined) {
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
              if ($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }
              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            }
            // ---------------------------------------------------------
            //                                                       MAX
            // ---------------------------------------------------------
            if ($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined) {
              var max = ($this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax"));
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";
              if ($this.data("validationMaxMessage")) {
                message = $this.data("validationMaxMessage");
              }
              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            }
            // ---------------------------------------------------------
            //                                                       MIN
            // ---------------------------------------------------------
            if ($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined) {
              var min = ($this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin"));
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";
              if ($this.data("validationMinMessage")) {
                message = $this.data("validationMinMessage");
              }
              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            }
            // ---------------------------------------------------------
            //                                                 MAXLENGTH
            // ---------------------------------------------------------
            if ($this.attr("maxlength") !== undefined) {
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
              if ($this.data("validationMaxlengthMessage")) {
                message = $this.data("validationMaxlengthMessage");
              }
              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            }
            // ---------------------------------------------------------
            //                                                 MINLENGTH
            // ---------------------------------------------------------
            if ($this.attr("minlength") !== undefined) {
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
              if ($this.data("validationMinlengthMessage")) {
                message = $this.data("validationMinlengthMessage");
              }
              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            }
            // ---------------------------------------------------------
            //                                                  REQUIRED
            // ---------------------------------------------------------
            if ($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined) {
              message = settings.builtInValidators.required.message;
              if ($this.data("validationRequiredMessage")) {
                message = $this.data("validationRequiredMessage");
              }
              $this.data("validationRequiredMessage", message);
            }
            // ---------------------------------------------------------
            //                                                    NUMBER
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number") {
              message = settings.builtInValidators.number.message;
              if ($this.data("validationNumberMessage")) {
                message = $this.data("validationNumberMessage");
              }
              $this.data("validationNumberMessage", message);
            }
            // ---------------------------------------------------------
            //                                                     EMAIL
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
              message = "Not a valid email address<!-- data-validator-validemail-message to override -->";
              if ($this.data("validationValidemailMessage")) {
                message = $this.data("validationValidemailMessage");
              } else if ($this.data("validationEmailMessage")) {
                message = $this.data("validationEmailMessage");
              }
              $this.data("validationValidemailMessage", message);
            }
            // ---------------------------------------------------------
            //                                                MINCHECKED
            // ---------------------------------------------------------
            if ($this.attr("minchecked") !== undefined) {
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
              if ($this.data("validationMincheckedMessage")) {
                message = $this.data("validationMincheckedMessage");
              }
              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            }
            // ---------------------------------------------------------
            //                                                MAXCHECKED
            // ---------------------------------------------------------
            if ($this.attr("maxchecked") !== undefined) {
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
              if ($this.data("validationMaxcheckedMessage")) {
                message = $this.data("validationMaxcheckedMessage");
              }
              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          }

          // =============================================================
          //                                       COLLECT VALIDATOR NAMES
          // =============================================================

          // Get named validators
          if ($this.data("validation") !== undefined) {
            validatorNames = $this.data("validation").split(",");
          }

          // Get extra ones defined on the element's data attributes
          $.each($this.data(), function (i, el) {
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");
            if (parts[0] === "validation" && parts[1]) {
              validatorNames.push(parts[1]);
            }
          });

          // =============================================================
          //                                     NORMALISE VALIDATOR NAMES
          // =============================================================

          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];

          do // repeatedly expand 'shortcut' validators into their real validators
          {
            // Uppercase only the first letter of each name
            $.each(validatorNames, function (i, el) {
              validatorNames[i] = formatValidatorName(el);
            });

            // Remove duplicate validator names
            validatorNames = $.unique(validatorNames);

            // Pull out the new validator names from each shortcut
            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, function(i, el) {
              if ($this.data("validation" + el + "Shortcut") !== undefined) {
                // Are these custom validators?
                // Pull them out!
                $.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2) {
                  newValidatorNamesToInspect.push(el2);
                });
              } else if (settings.builtInValidators[el.toLowerCase()]) {
                // Is this a recognised built-in?
                // Pull it out!
                var validator = settings.builtInValidators[el.toLowerCase()];
                if (validator.type.toLowerCase() === "shortcut") {
                  $.each(validator.shortcut.split(","), function (i, el) {
                    el = formatValidatorName(el);
                    newValidatorNamesToInspect.push(el);
                    validatorNames.push(el);
                  });
                }
              }
            });

            validatorNamesToInspect = newValidatorNamesToInspect;

          } while (validatorNamesToInspect.length > 0)

          // =============================================================
          //                                       SET UP VALIDATOR ARRAYS
          // =============================================================

          var validators = {};

          $.each(validatorNames, function (i, el) {
            // Set up the 'override' message
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = (message !== undefined);
            var foundValidator = false;
            message =
              (
                message
                  ? message
                  : "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->"
              )
            ;

            $.each(
              settings.validatorTypes,
              function (validatorType, validatorTemplate) {
                if (validators[validatorType] === undefined) {
                  validators[validatorType] = [];
                }
                if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
                  validators[validatorType].push(
                    $.extend(
                      true,
                      {
                        name: formatValidatorName(validatorTemplate.name),
                        message: message
                      },
                      validatorTemplate.init($this, el)
                    )
                  );
                  foundValidator = true;
                }
              }
            );

            if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {

              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
              if (hasOverrideMessage) {
                validator.message = message;
              }
              var validatorType = validator.type.toLowerCase();

              if (validatorType === "shortcut") {
                foundValidator = true;
              } else {
                $.each(
                  settings.validatorTypes,
                  function (validatorTemplateType, validatorTemplate) {
                    if (validators[validatorTemplateType] === undefined) {
                      validators[validatorTemplateType] = [];
                    }
                    if (!foundValidator && validatorType === validatorTemplateType.toLowerCase()) {
                      $this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()]);
                      validators[validatorType].push(
                        $.extend(
                          validator,
                          validatorTemplate.init($this, el)
                        )
                      );
                      foundValidator = true;
                    }
                  }
                );
              }
            }

            if (! foundValidator) {
              $.error("Cannot find validation info for '" + el + "'");
            }
          });

          // =============================================================
          //                                         STORE FALLBACK VALUES
          // =============================================================

          $helpBlock.data(
            "original-contents",
            (
              $helpBlock.data("original-contents")
                ? $helpBlock.data("original-contents")
                : $helpBlock.html()
            )
          );

          $helpBlock.data(
            "original-role",
            (
              $helpBlock.data("original-role")
                ? $helpBlock.data("original-role")
                : $helpBlock.attr("role")
            )
          );

          $controlGroup.data(
            "original-classes",
            (
              $controlGroup.data("original-clases")
                ? $controlGroup.data("original-classes")
                : $controlGroup.attr("class")
            )
          );

          $this.data(
            "original-aria-invalid",
            (
              $this.data("original-aria-invalid")
                ? $this.data("original-aria-invalid")
                : $this.attr("aria-invalid")
            )
          );

          // =============================================================
          //                                                    VALIDATION
          // =============================================================

          $this.bind(
            "validation.validation",
            function (event, params) {

              var value = getValue($this);

              // Get a list of the errors to apply
              var errorsFound = [];

              $.each(validators, function (validatorType, validatorTypeArray) {
                if (value || value.length || (params && params.includeEmpty) || (!!settings.validatorTypes[validatorType].blockSubmit && params && !!params.submitting)) {
                  $.each(validatorTypeArray, function (i, validator) {
                    if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
                      errorsFound.push(validator.message);
                    }
                  });
                }
              });

              return errorsFound;
            }
          );

          $this.bind(
            "getValidators.validation",
            function () {
              return validators;
            }
          );

          // =============================================================
          //                                             WATCH FOR CHANGES
          // =============================================================
          $this.bind(
            "submit.validation",
            function () {
              return $this.triggerHandler("change.validation", {submitting: true});
            }
          );
          $this.bind(
            [
              "keyup",
              "focus",
              "blur",
              "click",
              "keydown",
              "keypress",
              "change"
            ].join(".validation ") + ".validation",
            function (e, params) {

              var value = getValue($this);

              var errorsFound = [];

              $controlGroup.find("input,textarea,select").each(function (i, el) {
                var oldCount = errorsFound.length;
                $.each($(el).triggerHandler("validation.validation", params), function (j, message) {
                  errorsFound.push(message);
                });
                if (errorsFound.length > oldCount) {
                  $(el).attr("aria-invalid", "true");
                } else {
                  var original = $this.data("original-aria-invalid");
                  $(el).attr("aria-invalid", (original !== undefined ? original : false));
                }
              });

              $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");

              errorsFound = $.unique(errorsFound.sort());

              // Were there any errors?
              if (errorsFound.length) {
                // Better flag it up as a warning.
                $controlGroup.removeClass("success error").addClass("warning");

                // How many errors did we find?
                if (settings.options.semanticallyStrict && errorsFound.length === 1) {
                  // Only one? Being strict? Just output it.
                  $helpBlock.html(errorsFound[0] + 
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                } else {
                  // Multiple? Being sloppy? Glue them together into an UL.
                  $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" +
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                }
              } else {
                $controlGroup.removeClass("warning error success");
                if (value.length > 0) {
                  $controlGroup.addClass("success");
                }
                $helpBlock.html($helpBlock.data("original-contents"));
              }

              if (e.type === "blur") {
                $controlGroup.removeClass("success");
              }
            }
          );
          $this.bind("validationLostFocus.validation", function () {
            $controlGroup.removeClass("success");
          });
        });
      },
      destroy : function( ) {

        return this.each(
          function() {

            var
              $this = $(this),
              $controlGroup = $this.parents(".control-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first();

            // remove our events
            $this.unbind('.validation'); // events are namespaced.
            // reset help text
            $helpBlock.html($helpBlock.data("original-contents"));
            // reset classes
            $controlGroup.attr("class", $controlGroup.data("original-classes"));
            // reset aria
            $this.attr("aria-invalid", $this.data("original-aria-invalid"));
            // reset role
            $helpBlock.attr("role", $this.data("original-role"));
						// remove all elements we created
						if (createdElements.indexOf($helpBlock[0]) > -1) {
							$helpBlock.remove();
						}

          }
        );

      },
      collectErrors : function(includeEmpty) {

        var errorMessages = {};
        this.each(function (i, el) {
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {includeEmpty: true});
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });

        $.each(errorMessages, function (i, el) {
          if (el.length === 0) {
            delete errorMessages[i];
          }
        });

        return errorMessages;

      },
      hasErrors: function() {

        var errorMessages = [];

        this.each(function (i, el) {
          errorMessages = errorMessages.concat(
            $(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {submitting: true}) : []
          );
        });

        return (errorMessages.length > 0);
      },
      override : function (newDefaults) {
        defaults = $.extend(true, defaults, newDefaults);
      }
    },
		validatorTypes: {
      callback: {
        name: "callback",
        init: function ($this, name) {
          return {
            validatorName: name,
            callback: $this.data("validation" + name + "Callback"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (validator.lastValue === value && validator.lastFinished) {
            return !validator.lastValid;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;

            var rrjqbvValidator = validator;
            var rrjqbvThis = $this;
            executeFunctionByName(
              validator.callback,
              window,
              $this,
              value,
              function (data) {
                if (rrjqbvValidator.lastValue === data.value) {
                  rrjqbvValidator.lastValid = data.valid;
                  if (data.message) {
                    rrjqbvValidator.message = data.message;
                  }
                  rrjqbvValidator.lastFinished = true;
                  rrjqbvThis.data("validation" + rrjqbvValidator.validatorName + "Message", rrjqbvValidator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    rrjqbvThis.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              }
            );
          }

          return false;

        }
      },
      ajax: {
        name: "ajax",
        init: function ($this, name) {
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (""+validator.lastValue === ""+value && validator.lastFinished === true) {
            return validator.lastValid === false;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            $.ajax({
              url: validator.url,
              data: "value=" + value + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function (data) {
                if (""+validator.lastValue === ""+data.value) {
                  validator.lastValid = !!(data.valid);
                  if (data.message) {
                    validator.message = data.message;
                  }
                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    $this.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              },
              failure: function () {
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message);
                // Timeout is set to avoid problems with the events being considered 'already fired'
                setTimeout(function () {
                  $this.trigger("change.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;

        }
      },
			regex: {
				name: "regex",
				init: function ($this, name) {
					return {regex: regexFromString($this.data("validation" + name + "Regex"))};
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative)
						|| (validator.regex.test(value) && validator.negative);
				}
			},
			required: {
				name: "required",
				init: function ($this, name) {
					return {};
				},
				validate: function ($this, value, validator) {
					return !!(value.length === 0  && ! validator.negative)
						|| !!(value.length > 0 && validator.negative);
				},
        blockSubmit: true
			},
			match: {
				name: "match",
				init: function ($this, name) {
					var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
					element.bind("validation.validation", function () {
						$this.trigger("change.validation", {submitting: true});
					});
					return {"element": element};
				},
				validate: function ($this, value, validator) {
					return (value !== validator.element.val() && ! validator.negative)
						|| (value === validator.element.val() && validator.negative);
				},
        blockSubmit: true
			},
			max: {
				name: "max",
				init: function ($this, name) {
					return {max: $this.data("validation" + name + "Max")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative)
						|| (parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},
			min: {
				name: "min",
				init: function ($this, name) {
					return {min: $this.data("validation" + name + "Min")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative)
						|| (parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},
			maxlength: {
				name: "maxlength",
				init: function ($this, name) {
					return {maxlength: $this.data("validation" + name + "Maxlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length > validator.maxlength) && ! validator.negative)
						|| ((value.length <= validator.maxlength) && validator.negative);
				}
			},
			minlength: {
				name: "minlength",
				init: function ($this, name) {
					return {minlength: $this.data("validation" + name + "Minlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length < validator.minlength) && ! validator.negative)
						|| ((value.length >= validator.minlength) && validator.negative);
				}
			},
			maxchecked: {
				name: "maxchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {maxchecked: $this.data("validation" + name + "Maxchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				},
        blockSubmit: true
			},
			minchecked: {
				name: "minchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {minchecked: $this.data("validation" + name + "Minchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				},
        blockSubmit: true
			}
		},
		builtInValidators: {
			email: {
				name: "Email",
				type: "shortcut",
				shortcut: "validemail"
			},
			validemail: {
				name: "Validemail",
				type: "regex",
				regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
				message: "Not a valid email address<!-- data-validator-validemail-message to override -->"
			},
			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},
			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},
			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},
			number: {
				name: "Number",
				type: "regex",
				regex: "([+-]?\\\d+(\\\.\\\d*)?([eE][+-]?[0-9]+)?)?",
				message: "Must be a number<!-- data-validator-number-message to override -->"
			},
			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},
			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},
			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},
			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},
			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			}
		}
	};

	var formatValidatorName = function (name) {
		return name
			.toLowerCase()
			.replace(
				/(^|\s)([a-z])/g ,
				function(m,p1,p2) {
					return p1+p2.toUpperCase();
				}
			)
		;
	};

	var getValue = function ($this) {
		// Extract the value we're talking about
		var value = $this.val();
		var type = $this.attr("type");
		if (type === "checkbox") {
			value = ($this.is(":checked") ? value : "");
		}
		if (type === "radio") {
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? value : "");
		}
		return value;
	};

  function regexFromString(inputstring) {
		return new RegExp("^" + inputstring + "$");
	}

  /**
   * Thanks to Jason Bunting via StackOverflow.com
   *
   * http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string#answer-359910
   * Short link: http://tinyurl.com/executeFunctionByName
  **/
  function executeFunctionByName(functionName, context /*, args*/) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
  }

	$.fn.jqBootstrapValidation = function( method ) {

		if ( defaults.methods[method] ) {
			return defaults.methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return defaults.methods.init.apply( this, arguments );
		} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.jqBootstrapValidation' );
			return null;
		}

	};

  $.jqBootstrapValidation = function (options) {
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this,arguments);
  };

})( jQuery );

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxQm9vdHN0cmFwVmFsaWRhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwbHVnaW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganFCb290c3RyYXBWYWxpZGF0aW9uXG4gKiBBIHBsdWdpbiBmb3IgYXV0b21hdGluZyB2YWxpZGF0aW9uIG9uIFR3aXR0ZXIgQm9vdHN0cmFwIGZvcm1hdHRlZCBmb3Jtcy5cbiAqXG4gKiB2MS4zLjZcbiAqXG4gKiBMaWNlbnNlOiBNSVQgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHA+IC0gc2VlIExJQ0VOU0UgZmlsZVxuICpcbiAqIGh0dHA6Ly9SZWFjdGl2ZVJhdmVuLmdpdGh1Yi5jb20vanFCb290c3RyYXBWYWxpZGF0aW9uL1xuICovXG5cbihmdW5jdGlvbiggJCApe1xuXG5cdHZhciBjcmVhdGVkRWxlbWVudHMgPSBbXTtcblxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlcGVuZEV4aXN0aW5nSGVscEJsb2NrOiBmYWxzZSxcblx0XHRcdHNuaWZmSHRtbDogdHJ1ZSwgLy8gc25pZmYgZm9yICdyZXF1aXJlZCcsICdtYXhsZW5ndGgnLCBldGNcblx0XHRcdHByZXZlbnRTdWJtaXQ6IHRydWUsIC8vIHN0b3AgdGhlIGZvcm0gc3VibWl0IGV2ZW50IGZyb20gZmlyaW5nIGlmIHZhbGlkYXRpb24gZmFpbHNcblx0XHRcdHN1Ym1pdEVycm9yOiBmYWxzZSwgLy8gZnVuY3Rpb24gY2FsbGVkIGlmIHRoZXJlIGlzIGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIHN1Ym1pdFxuXHRcdFx0c3VibWl0U3VjY2VzczogZmFsc2UsIC8vIGZ1bmN0aW9uIGNhbGxlZCBqdXN0IGJlZm9yZSBhIHN1Y2Nlc3NmdWwgc3VibWl0IGV2ZW50IGlzIHNlbnQgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgc2VtYW50aWNhbGx5U3RyaWN0OiBmYWxzZSwgLy8gc2V0IHRvIHRydWUgdG8gdGlkeSB1cCBnZW5lcmF0ZWQgSFRNTCBvdXRwdXRcblx0XHRcdGF1dG9BZGQ6IHtcblx0XHRcdFx0aGVscEJsb2NrczogdHJ1ZVxuXHRcdFx0fSxcbiAgICAgICAgICAgIGZpbHRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiAkKHRoaXMpLmlzKFwiOnZpc2libGVcIik7IC8vIG9ubHkgdmFsaWRhdGUgZWxlbWVudHMgeW91IGNhbiBzZWVcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gdmFsaWRhdGUgZXZlcnl0aGluZ1xuICAgICAgICAgICAgfVxuXHRcdH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgaW5pdCA6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gICAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cyk7XG5cbiAgICAgICAgc2V0dGluZ3Mub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHNldHRpbmdzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciAkc2libGluZ0VsZW1lbnRzID0gdGhpcztcblxuICAgICAgICB2YXIgdW5pcXVlRm9ybXMgPSAkLnVuaXF1ZShcbiAgICAgICAgICAkc2libGluZ0VsZW1lbnRzLm1hcCggZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICQodGhpcykucGFyZW50cyhcImZvcm1cIilbMF07XG4gICAgICAgICAgfSkudG9BcnJheSgpXG4gICAgICAgICk7XG5cbiAgICAgICAgJCh1bmlxdWVGb3JtcykuYmluZChcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgdmFyIHdhcm5pbmdzRm91bmQgPSAwO1xuICAgICAgICAgIHZhciAkaW5wdXRzID0gJGZvcm0uZmluZChcImlucHV0LHRleHRhcmVhLHNlbGVjdFwiKS5ub3QoXCJbdHlwZT1zdWJtaXRdLFt0eXBlPWltYWdlXVwiKS5maWx0ZXIoc2V0dGluZ3Mub3B0aW9ucy5maWx0ZXIpO1xuICAgICAgICAgICRpbnB1dHMudHJpZ2dlcihcInN1Ym1pdC52YWxpZGF0aW9uXCIpLnRyaWdnZXIoXCJ2YWxpZGF0aW9uTG9zdEZvY3VzLnZhbGlkYXRpb25cIik7XG5cbiAgICAgICAgICAkaW5wdXRzLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKGVsKSxcbiAgICAgICAgICAgICAgJGNvbnRyb2xHcm91cCA9ICR0aGlzLnBhcmVudHMoXCIuY29udHJvbC1ncm91cFwiKS5maXJzdCgpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAkY29udHJvbEdyb3VwLmhhc0NsYXNzKFwid2FybmluZ1wiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICRjb250cm9sR3JvdXAucmVtb3ZlQ2xhc3MoXCJ3YXJuaW5nXCIpLmFkZENsYXNzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgIHdhcm5pbmdzRm91bmQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICRpbnB1dHMudHJpZ2dlcihcInZhbGlkYXRpb25Mb3N0Rm9jdXMudmFsaWRhdGlvblwiKTtcblxuICAgICAgICAgIGlmICh3YXJuaW5nc0ZvdW5kKSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3Mub3B0aW9ucy5wcmV2ZW50U3VibWl0KSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRmb3JtLmFkZENsYXNzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHNldHRpbmdzLm9wdGlvbnMuc3VibWl0RXJyb3IpKSB7XG4gICAgICAgICAgICAgIHNldHRpbmdzLm9wdGlvbnMuc3VibWl0RXJyb3IoJGZvcm0sIGUsICRpbnB1dHMuanFCb290c3RyYXBWYWxpZGF0aW9uKFwiY29sbGVjdEVycm9yc1wiLCB0cnVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRmb3JtLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHNldHRpbmdzLm9wdGlvbnMuc3VibWl0U3VjY2VzcykpIHtcbiAgICAgICAgICAgICAgc2V0dGluZ3Mub3B0aW9ucy5zdWJtaXRTdWNjZXNzKCRmb3JtLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgIC8vIEdldCByZWZlcmVuY2VzIHRvIGV2ZXJ5dGhpbmcgd2UncmUgaW50ZXJlc3RlZCBpblxuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAkY29udHJvbEdyb3VwID0gJHRoaXMucGFyZW50cyhcIi5jb250cm9sLWdyb3VwXCIpLmZpcnN0KCksXG4gICAgICAgICAgICAkaGVscEJsb2NrID0gJGNvbnRyb2xHcm91cC5maW5kKFwiLmhlbHAtYmxvY2tcIikuZmlyc3QoKSxcbiAgICAgICAgICAgICRmb3JtID0gJHRoaXMucGFyZW50cyhcImZvcm1cIikuZmlyc3QoKSxcbiAgICAgICAgICAgIHZhbGlkYXRvck5hbWVzID0gW107XG5cbiAgICAgICAgICAvLyBjcmVhdGUgbWVzc2FnZSBjb250YWluZXIgaWYgbm90IGV4aXN0c1xuICAgICAgICAgIGlmICghJGhlbHBCbG9jay5sZW5ndGggJiYgc2V0dGluZ3Mub3B0aW9ucy5hdXRvQWRkICYmIHNldHRpbmdzLm9wdGlvbnMuYXV0b0FkZC5oZWxwQmxvY2tzKSB7XG4gICAgICAgICAgICAgICRoZWxwQmxvY2sgPSAkKCc8ZGl2IGNsYXNzPVwiaGVscC1ibG9ja1wiIC8+Jyk7XG4gICAgICAgICAgICAgICRjb250cm9sR3JvdXAuZmluZCgnLmNvbnRyb2xzJykuYXBwZW5kKCRoZWxwQmxvY2spO1xuXHRcdFx0XHRcdFx0XHRjcmVhdGVkRWxlbWVudHMucHVzaCgkaGVscEJsb2NrWzBdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU05JRkYgSFRNTCBGT1IgVkFMSURBVE9SU1xuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAgIC8vICpzbm9ydCBzbmlmZiBzbnVmZmxlKlxuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLm9wdGlvbnMuc25pZmZIdG1sKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUEFUVEVSTlxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoJHRoaXMuYXR0cihcInBhdHRlcm5cIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gXCJOb3QgaW4gdGhlIGV4cGVjdGVkIGZvcm1hdDwhLS0gZGF0YS12YWxpZGF0aW9uLXBhdHRlcm4tbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uUGF0dGVybk1lc3NhZ2VcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJHRoaXMuZGF0YShcInZhbGlkYXRpb25QYXR0ZXJuTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblBhdHRlcm5NZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblBhdHRlcm5SZWdleFwiLCAkdGhpcy5hdHRyKFwicGF0dGVyblwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1BWFxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoJHRoaXMuYXR0cihcIm1heFwiKSAhPT0gdW5kZWZpbmVkIHx8ICR0aGlzLmF0dHIoXCJhcmlhLXZhbHVlbWF4XCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdmFyIG1heCA9ICgkdGhpcy5hdHRyKFwibWF4XCIpICE9PSB1bmRlZmluZWQgPyAkdGhpcy5hdHRyKFwibWF4XCIpIDogJHRoaXMuYXR0cihcImFyaWEtdmFsdWVtYXhcIikpO1xuICAgICAgICAgICAgICBtZXNzYWdlID0gXCJUb28gaGlnaDogTWF4aW11bSBvZiAnXCIgKyBtYXggKyBcIic8IS0tIGRhdGEtdmFsaWRhdGlvbi1tYXgtbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWF4TWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heE1lc3NhZ2VcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHRoaXMuZGF0YShcInZhbGlkYXRpb25NYXhNZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heE1heFwiLCBtYXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNSU5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCR0aGlzLmF0dHIoXCJtaW5cIikgIT09IHVuZGVmaW5lZCB8fCAkdGhpcy5hdHRyKFwiYXJpYS12YWx1ZW1pblwiKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhciBtaW4gPSAoJHRoaXMuYXR0cihcIm1pblwiKSAhPT0gdW5kZWZpbmVkID8gJHRoaXMuYXR0cihcIm1pblwiKSA6ICR0aGlzLmF0dHIoXCJhcmlhLXZhbHVlbWluXCIpKTtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiVG9vIGxvdzogTWluaW11bSBvZiAnXCIgKyBtaW4gKyBcIic8IS0tIGRhdGEtdmFsaWRhdGlvbi1taW4tbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWluTWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1pbk1lc3NhZ2VcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHRoaXMuZGF0YShcInZhbGlkYXRpb25NaW5NZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1pbk1pblwiLCBtaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNQVhMRU5HVEhcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCR0aGlzLmF0dHIoXCJtYXhsZW5ndGhcIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gXCJUb28gbG9uZzogTWF4aW11bSBvZiAnXCIgKyAkdGhpcy5hdHRyKFwibWF4bGVuZ3RoXCIpICsgXCInIGNoYXJhY3RlcnM8IS0tIGRhdGEtdmFsaWRhdGlvbi1tYXhsZW5ndGgtbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWF4bGVuZ3RoTWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heGxlbmd0aE1lc3NhZ2VcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHRoaXMuZGF0YShcInZhbGlkYXRpb25NYXhsZW5ndGhNZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heGxlbmd0aE1heGxlbmd0aFwiLCAkdGhpcy5hdHRyKFwibWF4bGVuZ3RoXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlOTEVOR1RIXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKFwibWlubGVuZ3RoXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiVG9vIHNob3J0OiBNaW5pbXVtIG9mICdcIiArICR0aGlzLmF0dHIoXCJtaW5sZW5ndGhcIikgKyBcIicgY2hhcmFjdGVyczwhLS0gZGF0YS12YWxpZGF0aW9uLW1pbmxlbmd0aC1tZXNzYWdlIHRvIG92ZXJyaWRlIC0tPlwiO1xuICAgICAgICAgICAgICBpZiAoJHRoaXMuZGF0YShcInZhbGlkYXRpb25NaW5sZW5ndGhNZXNzYWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWlubGVuZ3RoTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1pbmxlbmd0aE1lc3NhZ2VcIiwgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWlubGVuZ3RoTWlubGVuZ3RoXCIsICR0aGlzLmF0dHIoXCJtaW5sZW5ndGhcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUkVRVUlSRURcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCR0aGlzLmF0dHIoXCJyZXF1aXJlZFwiKSAhPT0gdW5kZWZpbmVkIHx8ICR0aGlzLmF0dHIoXCJhcmlhLXJlcXVpcmVkXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IHNldHRpbmdzLmJ1aWx0SW5WYWxpZGF0b3JzLnJlcXVpcmVkLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmICgkdGhpcy5kYXRhKFwidmFsaWRhdGlvblJlcXVpcmVkTWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblJlcXVpcmVkTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblJlcXVpcmVkTWVzc2FnZVwiLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTlVNQkVSXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKFwidHlwZVwiKSAhPT0gdW5kZWZpbmVkICYmICR0aGlzLmF0dHIoXCJ0eXBlXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IHNldHRpbmdzLmJ1aWx0SW5WYWxpZGF0b3JzLm51bWJlci5tZXNzYWdlO1xuICAgICAgICAgICAgICBpZiAoJHRoaXMuZGF0YShcInZhbGlkYXRpb25OdW1iZXJNZXNzYWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTnVtYmVyTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk51bWJlck1lc3NhZ2VcIiwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFTUFJTFxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoJHRoaXMuYXR0cihcInR5cGVcIikgIT09IHVuZGVmaW5lZCAmJiAkdGhpcy5hdHRyKFwidHlwZVwiKS50b0xvd2VyQ2FzZSgpID09PSBcImVtYWlsXCIpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiTm90IGEgdmFsaWQgZW1haWwgYWRkcmVzczwhLS0gZGF0YS12YWxpZGF0b3ItdmFsaWRlbWFpbC1tZXNzYWdlIHRvIG92ZXJyaWRlIC0tPlwiO1xuICAgICAgICAgICAgICBpZiAoJHRoaXMuZGF0YShcInZhbGlkYXRpb25WYWxpZGVtYWlsTWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblZhbGlkZW1haWxNZXNzYWdlXCIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uRW1haWxNZXNzYWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uRW1haWxNZXNzYWdlXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uVmFsaWRlbWFpbE1lc3NhZ2VcIiwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTUlOQ0hFQ0tFRFxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoJHRoaXMuYXR0cihcIm1pbmNoZWNrZWRcIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gXCJOb3QgZW5vdWdoIG9wdGlvbnMgY2hlY2tlZDsgTWluaW11bSBvZiAnXCIgKyAkdGhpcy5hdHRyKFwibWluY2hlY2tlZFwiKSArIFwiJyByZXF1aXJlZDwhLS0gZGF0YS12YWxpZGF0aW9uLW1pbmNoZWNrZWQtbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWluY2hlY2tlZE1lc3NhZ2VcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJHRoaXMuZGF0YShcInZhbGlkYXRpb25NaW5jaGVja2VkTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1pbmNoZWNrZWRNZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1pbmNoZWNrZWRNaW5jaGVja2VkXCIsICR0aGlzLmF0dHIoXCJtaW5jaGVja2VkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNQVhDSEVDS0VEXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKFwibWF4Y2hlY2tlZFwiKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlRvbyBtYW55IG9wdGlvbnMgY2hlY2tlZDsgTWF4aW11bSBvZiAnXCIgKyAkdGhpcy5hdHRyKFwibWF4Y2hlY2tlZFwiKSArIFwiJyByZXF1aXJlZDwhLS0gZGF0YS12YWxpZGF0aW9uLW1heGNoZWNrZWQtbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIjtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uTWF4Y2hlY2tlZE1lc3NhZ2VcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJHRoaXMuZGF0YShcInZhbGlkYXRpb25NYXhjaGVja2VkTWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heGNoZWNrZWRNZXNzYWdlXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAkdGhpcy5kYXRhKFwidmFsaWRhdGlvbk1heGNoZWNrZWRNYXhjaGVja2VkXCIsICR0aGlzLmF0dHIoXCJtYXhjaGVja2VkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDT0xMRUNUIFZBTElEQVRPUiBOQU1FU1xuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAgIC8vIEdldCBuYW1lZCB2YWxpZGF0b3JzXG4gICAgICAgICAgaWYgKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvck5hbWVzID0gJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIikuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEdldCBleHRyYSBvbmVzIGRlZmluZWQgb24gdGhlIGVsZW1lbnQncyBkYXRhIGF0dHJpYnV0ZXNcbiAgICAgICAgICAkLmVhY2goJHRoaXMuZGF0YSgpLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGkucmVwbGFjZSgvKFtBLVpdKS9nLCBcIiwkMVwiKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBpZiAocGFydHNbMF0gPT09IFwidmFsaWRhdGlvblwiICYmIHBhcnRzWzFdKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRvck5hbWVzLnB1c2gocGFydHNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5PUk1BTElTRSBWQUxJREFUT1IgTkFNRVNcbiAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgICB2YXIgdmFsaWRhdG9yTmFtZXNUb0luc3BlY3QgPSB2YWxpZGF0b3JOYW1lcztcbiAgICAgICAgICB2YXIgbmV3VmFsaWRhdG9yTmFtZXNUb0luc3BlY3QgPSBbXTtcblxuICAgICAgICAgIGRvIC8vIHJlcGVhdGVkbHkgZXhwYW5kICdzaG9ydGN1dCcgdmFsaWRhdG9ycyBpbnRvIHRoZWlyIHJlYWwgdmFsaWRhdG9yc1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIFVwcGVyY2FzZSBvbmx5IHRoZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCBuYW1lXG4gICAgICAgICAgICAkLmVhY2godmFsaWRhdG9yTmFtZXMsIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICB2YWxpZGF0b3JOYW1lc1tpXSA9IGZvcm1hdFZhbGlkYXRvck5hbWUoZWwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGUgdmFsaWRhdG9yIG5hbWVzXG4gICAgICAgICAgICB2YWxpZGF0b3JOYW1lcyA9ICQudW5pcXVlKHZhbGlkYXRvck5hbWVzKTtcblxuICAgICAgICAgICAgLy8gUHVsbCBvdXQgdGhlIG5ldyB2YWxpZGF0b3IgbmFtZXMgZnJvbSBlYWNoIHNob3J0Y3V0XG4gICAgICAgICAgICBuZXdWYWxpZGF0b3JOYW1lc1RvSW5zcGVjdCA9IFtdO1xuICAgICAgICAgICAgJC5lYWNoKHZhbGlkYXRvck5hbWVzVG9JbnNwZWN0LCBmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICBpZiAoJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIiArIGVsICsgXCJTaG9ydGN1dFwiKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQXJlIHRoZXNlIGN1c3RvbSB2YWxpZGF0b3JzP1xuICAgICAgICAgICAgICAgIC8vIFB1bGwgdGhlbSBvdXQhXG4gICAgICAgICAgICAgICAgJC5lYWNoKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBlbCArIFwiU2hvcnRjdXRcIikuc3BsaXQoXCIsXCIpLCBmdW5jdGlvbihpMiwgZWwyKSB7XG4gICAgICAgICAgICAgICAgICBuZXdWYWxpZGF0b3JOYW1lc1RvSW5zcGVjdC5wdXNoKGVsMik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYnVpbHRJblZhbGlkYXRvcnNbZWwudG9Mb3dlckNhc2UoKV0pIHtcbiAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIGEgcmVjb2duaXNlZCBidWlsdC1pbj9cbiAgICAgICAgICAgICAgICAvLyBQdWxsIGl0IG91dCFcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gc2V0dGluZ3MuYnVpbHRJblZhbGlkYXRvcnNbZWwudG9Mb3dlckNhc2UoKV07XG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvci50eXBlLnRvTG93ZXJDYXNlKCkgPT09IFwic2hvcnRjdXRcIikge1xuICAgICAgICAgICAgICAgICAgJC5lYWNoKHZhbGlkYXRvci5zaG9ydGN1dC5zcGxpdChcIixcIiksIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGZvcm1hdFZhbGlkYXRvck5hbWUoZWwpO1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWxpZGF0b3JOYW1lc1RvSW5zcGVjdC5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yTmFtZXMucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YWxpZGF0b3JOYW1lc1RvSW5zcGVjdCA9IG5ld1ZhbGlkYXRvck5hbWVzVG9JbnNwZWN0O1xuXG4gICAgICAgICAgfSB3aGlsZSAodmFsaWRhdG9yTmFtZXNUb0luc3BlY3QubGVuZ3RoID4gMClcblxuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNFVCBVUCBWQUxJREFUT1IgQVJSQVlTXG4gICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgICAgdmFyIHZhbGlkYXRvcnMgPSB7fTtcblxuICAgICAgICAgICQuZWFjaCh2YWxpZGF0b3JOYW1lcywgZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAvLyBTZXQgdXAgdGhlICdvdmVycmlkZScgbWVzc2FnZVxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblwiICsgZWwgKyBcIk1lc3NhZ2VcIik7XG4gICAgICAgICAgICB2YXIgaGFzT3ZlcnJpZGVNZXNzYWdlID0gKG1lc3NhZ2UgIT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB2YXIgZm91bmRWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgPyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICA6IFwiJ1wiICsgZWwgKyBcIicgdmFsaWRhdGlvbiBmYWlsZWQgPCEtLSBBZGQgYXR0cmlidXRlICdkYXRhLXZhbGlkYXRpb24tXCIgKyBlbC50b0xvd2VyQ2FzZSgpICsgXCItbWVzc2FnZScgdG8gaW5wdXQgdG8gY2hhbmdlIHRoaXMgbWVzc2FnZSAtLT5cIlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICQuZWFjaChcbiAgICAgICAgICAgICAgc2V0dGluZ3MudmFsaWRhdG9yVHlwZXMsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWxpZGF0b3JUeXBlLCB2YWxpZGF0b3JUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JzW3ZhbGlkYXRvclR5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnNbdmFsaWRhdG9yVHlwZV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZFZhbGlkYXRvciAmJiAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblwiICsgZWwgKyBmb3JtYXRWYWxpZGF0b3JOYW1lKHZhbGlkYXRvclRlbXBsYXRlLm5hbWUpKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzW3ZhbGlkYXRvclR5cGVdLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICQuZXh0ZW5kKFxuICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZm9ybWF0VmFsaWRhdG9yTmFtZSh2YWxpZGF0b3JUZW1wbGF0ZS5uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvclRlbXBsYXRlLmluaXQoJHRoaXMsIGVsKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgZm91bmRWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFmb3VuZFZhbGlkYXRvciAmJiBzZXR0aW5ncy5idWlsdEluVmFsaWRhdG9yc1tlbC50b0xvd2VyQ2FzZSgpXSkge1xuXG4gICAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSAkLmV4dGVuZCh0cnVlLCB7fSwgc2V0dGluZ3MuYnVpbHRJblZhbGlkYXRvcnNbZWwudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICAgICAgICBpZiAoaGFzT3ZlcnJpZGVNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JUeXBlID0gdmFsaWRhdG9yLnR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yVHlwZSA9PT0gXCJzaG9ydGN1dFwiKSB7XG4gICAgICAgICAgICAgICAgZm91bmRWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQuZWFjaChcbiAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbGlkYXRvclR5cGVzLFxuICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbGlkYXRvclRlbXBsYXRlVHlwZSwgdmFsaWRhdG9yVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvcnNbdmFsaWRhdG9yVGVtcGxhdGVUeXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yc1t2YWxpZGF0b3JUZW1wbGF0ZVR5cGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZFZhbGlkYXRvciAmJiB2YWxpZGF0b3JUeXBlID09PSB2YWxpZGF0b3JUZW1wbGF0ZVR5cGUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBlbCArIGZvcm1hdFZhbGlkYXRvck5hbWUodmFsaWRhdG9yVGVtcGxhdGUubmFtZSksIHZhbGlkYXRvclt2YWxpZGF0b3JUZW1wbGF0ZS5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzW3ZhbGlkYXRvclR5cGVdLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JUZW1wbGF0ZS5pbml0KCR0aGlzLCBlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgIGZvdW5kVmFsaWRhdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEgZm91bmRWYWxpZGF0b3IpIHtcbiAgICAgICAgICAgICAgJC5lcnJvcihcIkNhbm5vdCBmaW5kIHZhbGlkYXRpb24gaW5mbyBmb3IgJ1wiICsgZWwgKyBcIidcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNUT1JFIEZBTExCQUNLIFZBTFVFU1xuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAgICRoZWxwQmxvY2suZGF0YShcbiAgICAgICAgICAgIFwib3JpZ2luYWwtY29udGVudHNcIixcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgJGhlbHBCbG9jay5kYXRhKFwib3JpZ2luYWwtY29udGVudHNcIilcbiAgICAgICAgICAgICAgICA/ICRoZWxwQmxvY2suZGF0YShcIm9yaWdpbmFsLWNvbnRlbnRzXCIpXG4gICAgICAgICAgICAgICAgOiAkaGVscEJsb2NrLmh0bWwoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAkaGVscEJsb2NrLmRhdGEoXG4gICAgICAgICAgICBcIm9yaWdpbmFsLXJvbGVcIixcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgJGhlbHBCbG9jay5kYXRhKFwib3JpZ2luYWwtcm9sZVwiKVxuICAgICAgICAgICAgICAgID8gJGhlbHBCbG9jay5kYXRhKFwib3JpZ2luYWwtcm9sZVwiKVxuICAgICAgICAgICAgICAgIDogJGhlbHBCbG9jay5hdHRyKFwicm9sZVwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAkY29udHJvbEdyb3VwLmRhdGEoXG4gICAgICAgICAgICBcIm9yaWdpbmFsLWNsYXNzZXNcIixcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgJGNvbnRyb2xHcm91cC5kYXRhKFwib3JpZ2luYWwtY2xhc2VzXCIpXG4gICAgICAgICAgICAgICAgPyAkY29udHJvbEdyb3VwLmRhdGEoXCJvcmlnaW5hbC1jbGFzc2VzXCIpXG4gICAgICAgICAgICAgICAgOiAkY29udHJvbEdyb3VwLmF0dHIoXCJjbGFzc1wiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAkdGhpcy5kYXRhKFxuICAgICAgICAgICAgXCJvcmlnaW5hbC1hcmlhLWludmFsaWRcIixcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgJHRoaXMuZGF0YShcIm9yaWdpbmFsLWFyaWEtaW52YWxpZFwiKVxuICAgICAgICAgICAgICAgID8gJHRoaXMuZGF0YShcIm9yaWdpbmFsLWFyaWEtaW52YWxpZFwiKVxuICAgICAgICAgICAgICAgIDogJHRoaXMuYXR0cihcImFyaWEtaW52YWxpZFwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVkFMSURBVElPTlxuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAgICR0aGlzLmJpbmQoXG4gICAgICAgICAgICBcInZhbGlkYXRpb24udmFsaWRhdGlvblwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcblxuICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBnZXRWYWx1ZSgkdGhpcyk7XG5cbiAgICAgICAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiB0aGUgZXJyb3JzIHRvIGFwcGx5XG4gICAgICAgICAgICAgIHZhciBlcnJvcnNGb3VuZCA9IFtdO1xuXG4gICAgICAgICAgICAgICQuZWFjaCh2YWxpZGF0b3JzLCBmdW5jdGlvbiAodmFsaWRhdG9yVHlwZSwgdmFsaWRhdG9yVHlwZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIHx8IHZhbHVlLmxlbmd0aCB8fCAocGFyYW1zICYmIHBhcmFtcy5pbmNsdWRlRW1wdHkpIHx8ICghIXNldHRpbmdzLnZhbGlkYXRvclR5cGVzW3ZhbGlkYXRvclR5cGVdLmJsb2NrU3VibWl0ICYmIHBhcmFtcyAmJiAhIXBhcmFtcy5zdWJtaXR0aW5nKSkge1xuICAgICAgICAgICAgICAgICAgJC5lYWNoKHZhbGlkYXRvclR5cGVBcnJheSwgZnVuY3Rpb24gKGksIHZhbGlkYXRvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdG9yVHlwZXNbdmFsaWRhdG9yVHlwZV0udmFsaWRhdGUoJHRoaXMsIHZhbHVlLCB2YWxpZGF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZXJyb3JzRm91bmQucHVzaCh2YWxpZGF0b3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGVycm9yc0ZvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAkdGhpcy5iaW5kKFxuICAgICAgICAgICAgXCJnZXRWYWxpZGF0b3JzLnZhbGlkYXRpb25cIixcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdBVENIIEZPUiBDSEFOR0VTXG4gICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgICR0aGlzLmJpbmQoXG4gICAgICAgICAgICBcInN1Ym1pdC52YWxpZGF0aW9uXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VySGFuZGxlcihcImNoYW5nZS52YWxpZGF0aW9uXCIsIHtzdWJtaXR0aW5nOiB0cnVlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgICAkdGhpcy5iaW5kKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcImtleXVwXCIsXG4gICAgICAgICAgICAgIFwiZm9jdXNcIixcbiAgICAgICAgICAgICAgXCJibHVyXCIsXG4gICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgXCJrZXlkb3duXCIsXG4gICAgICAgICAgICAgIFwia2V5cHJlc3NcIixcbiAgICAgICAgICAgICAgXCJjaGFuZ2VcIlxuICAgICAgICAgICAgXS5qb2luKFwiLnZhbGlkYXRpb24gXCIpICsgXCIudmFsaWRhdGlvblwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGUsIHBhcmFtcykge1xuXG4gICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGdldFZhbHVlKCR0aGlzKTtcblxuICAgICAgICAgICAgICB2YXIgZXJyb3JzRm91bmQgPSBbXTtcblxuICAgICAgICAgICAgICAkY29udHJvbEdyb3VwLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkQ291bnQgPSBlcnJvcnNGb3VuZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgJC5lYWNoKCQoZWwpLnRyaWdnZXJIYW5kbGVyKFwidmFsaWRhdGlvbi52YWxpZGF0aW9uXCIsIHBhcmFtcyksIGZ1bmN0aW9uIChqLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICBlcnJvcnNGb3VuZC5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcnNGb3VuZC5sZW5ndGggPiBvbGRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgJChlbCkuYXR0cihcImFyaWEtaW52YWxpZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbCA9ICR0aGlzLmRhdGEoXCJvcmlnaW5hbC1hcmlhLWludmFsaWRcIik7XG4gICAgICAgICAgICAgICAgICAkKGVsKS5hdHRyKFwiYXJpYS1pbnZhbGlkXCIsIChvcmlnaW5hbCAhPT0gdW5kZWZpbmVkID8gb3JpZ2luYWwgOiBmYWxzZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgJGZvcm0uZmluZChcImlucHV0LHNlbGVjdCx0ZXh0YXJlYVwiKS5ub3QoJHRoaXMpLm5vdChcIltuYW1lPVxcXCJcIiArICR0aGlzLmF0dHIoXCJuYW1lXCIpICsgXCJcXFwiXVwiKS50cmlnZ2VyKFwidmFsaWRhdGlvbkxvc3RGb2N1cy52YWxpZGF0aW9uXCIpO1xuXG4gICAgICAgICAgICAgIGVycm9yc0ZvdW5kID0gJC51bmlxdWUoZXJyb3JzRm91bmQuc29ydCgpKTtcblxuICAgICAgICAgICAgICAvLyBXZXJlIHRoZXJlIGFueSBlcnJvcnM/XG4gICAgICAgICAgICAgIGlmIChlcnJvcnNGb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBCZXR0ZXIgZmxhZyBpdCB1cCBhcyBhIHdhcm5pbmcuXG4gICAgICAgICAgICAgICAgJGNvbnRyb2xHcm91cC5yZW1vdmVDbGFzcyhcInN1Y2Nlc3MgZXJyb3JcIikuYWRkQ2xhc3MoXCJ3YXJuaW5nXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gSG93IG1hbnkgZXJyb3JzIGRpZCB3ZSBmaW5kP1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5vcHRpb25zLnNlbWFudGljYWxseVN0cmljdCAmJiBlcnJvcnNGb3VuZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgIC8vIE9ubHkgb25lPyBCZWluZyBzdHJpY3Q/IEp1c3Qgb3V0cHV0IGl0LlxuICAgICAgICAgICAgICAgICAgJGhlbHBCbG9jay5odG1sKGVycm9yc0ZvdW5kWzBdICsgXG4gICAgICAgICAgICAgICAgICAgICggc2V0dGluZ3Mub3B0aW9ucy5wcmVwZW5kRXhpc3RpbmdIZWxwQmxvY2sgPyAkaGVscEJsb2NrLmRhdGEoXCJvcmlnaW5hbC1jb250ZW50c1wiKSA6IFwiXCIgKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIE11bHRpcGxlPyBCZWluZyBzbG9wcHk/IEdsdWUgdGhlbSB0b2dldGhlciBpbnRvIGFuIFVMLlxuICAgICAgICAgICAgICAgICAgJGhlbHBCbG9jay5odG1sKFwiPHVsIHJvbGU9XFxcImFsZXJ0XFxcIj48bGk+XCIgKyBlcnJvcnNGb3VuZC5qb2luKFwiPC9saT48bGk+XCIpICsgXCI8L2xpPjwvdWw+XCIgK1xuICAgICAgICAgICAgICAgICAgICAoIHNldHRpbmdzLm9wdGlvbnMucHJlcGVuZEV4aXN0aW5nSGVscEJsb2NrID8gJGhlbHBCbG9jay5kYXRhKFwib3JpZ2luYWwtY29udGVudHNcIikgOiBcIlwiICkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkY29udHJvbEdyb3VwLnJlbW92ZUNsYXNzKFwid2FybmluZyBlcnJvciBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAkY29udHJvbEdyb3VwLmFkZENsYXNzKFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGhlbHBCbG9jay5odG1sKCRoZWxwQmxvY2suZGF0YShcIm9yaWdpbmFsLWNvbnRlbnRzXCIpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwiYmx1clwiKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRyb2xHcm91cC5yZW1vdmVDbGFzcyhcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgICR0aGlzLmJpbmQoXCJ2YWxpZGF0aW9uTG9zdEZvY3VzLnZhbGlkYXRpb25cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbnRyb2xHcm91cC5yZW1vdmVDbGFzcyhcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiggKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChcbiAgICAgICAgICBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgJGNvbnRyb2xHcm91cCA9ICR0aGlzLnBhcmVudHMoXCIuY29udHJvbC1ncm91cFwiKS5maXJzdCgpLFxuICAgICAgICAgICAgICAkaGVscEJsb2NrID0gJGNvbnRyb2xHcm91cC5maW5kKFwiLmhlbHAtYmxvY2tcIikuZmlyc3QoKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIG91ciBldmVudHNcbiAgICAgICAgICAgICR0aGlzLnVuYmluZCgnLnZhbGlkYXRpb24nKTsgLy8gZXZlbnRzIGFyZSBuYW1lc3BhY2VkLlxuICAgICAgICAgICAgLy8gcmVzZXQgaGVscCB0ZXh0XG4gICAgICAgICAgICAkaGVscEJsb2NrLmh0bWwoJGhlbHBCbG9jay5kYXRhKFwib3JpZ2luYWwtY29udGVudHNcIikpO1xuICAgICAgICAgICAgLy8gcmVzZXQgY2xhc3Nlc1xuICAgICAgICAgICAgJGNvbnRyb2xHcm91cC5hdHRyKFwiY2xhc3NcIiwgJGNvbnRyb2xHcm91cC5kYXRhKFwib3JpZ2luYWwtY2xhc3Nlc1wiKSk7XG4gICAgICAgICAgICAvLyByZXNldCBhcmlhXG4gICAgICAgICAgICAkdGhpcy5hdHRyKFwiYXJpYS1pbnZhbGlkXCIsICR0aGlzLmRhdGEoXCJvcmlnaW5hbC1hcmlhLWludmFsaWRcIikpO1xuICAgICAgICAgICAgLy8gcmVzZXQgcm9sZVxuICAgICAgICAgICAgJGhlbHBCbG9jay5hdHRyKFwicm9sZVwiLCAkdGhpcy5kYXRhKFwib3JpZ2luYWwtcm9sZVwiKSk7XG5cdFx0XHRcdFx0XHQvLyByZW1vdmUgYWxsIGVsZW1lbnRzIHdlIGNyZWF0ZWRcblx0XHRcdFx0XHRcdGlmIChjcmVhdGVkRWxlbWVudHMuaW5kZXhPZigkaGVscEJsb2NrWzBdKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdCRoZWxwQmxvY2sucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9XG5cbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgIH0sXG4gICAgICBjb2xsZWN0RXJyb3JzIDogZnVuY3Rpb24oaW5jbHVkZUVtcHR5KSB7XG5cbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZXMgPSB7fTtcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgICB2YXIgbmFtZSA9ICRlbC5hdHRyKFwibmFtZVwiKTtcbiAgICAgICAgICB2YXIgZXJyb3JzID0gJGVsLnRyaWdnZXJIYW5kbGVyKFwidmFsaWRhdGlvbi52YWxpZGF0aW9uXCIsIHtpbmNsdWRlRW1wdHk6IHRydWV9KTtcbiAgICAgICAgICBlcnJvck1lc3NhZ2VzW25hbWVdID0gJC5leHRlbmQodHJ1ZSwgZXJyb3JzLCBlcnJvck1lc3NhZ2VzW25hbWVdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5lYWNoKGVycm9yTWVzc2FnZXMsIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgIGlmIChlbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBlcnJvck1lc3NhZ2VzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZXM7XG5cbiAgICAgIH0sXG4gICAgICBoYXNFcnJvcnM6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2VzID0gW107XG5cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgIGVycm9yTWVzc2FnZXMgPSBlcnJvck1lc3NhZ2VzLmNvbmNhdChcbiAgICAgICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKFwiZ2V0VmFsaWRhdG9ycy52YWxpZGF0aW9uXCIpID8gJChlbCkudHJpZ2dlckhhbmRsZXIoXCJ2YWxpZGF0aW9uLnZhbGlkYXRpb25cIiwge3N1Ym1pdHRpbmc6IHRydWV9KSA6IFtdXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChlcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApO1xuICAgICAgfSxcbiAgICAgIG92ZXJyaWRlIDogZnVuY3Rpb24gKG5ld0RlZmF1bHRzKSB7XG4gICAgICAgIGRlZmF1bHRzID0gJC5leHRlbmQodHJ1ZSwgZGVmYXVsdHMsIG5ld0RlZmF1bHRzKTtcbiAgICAgIH1cbiAgICB9LFxuXHRcdHZhbGlkYXRvclR5cGVzOiB7XG4gICAgICBjYWxsYmFjazoge1xuICAgICAgICBuYW1lOiBcImNhbGxiYWNrXCIsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgkdGhpcywgbmFtZSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWxpZGF0b3JOYW1lOiBuYW1lLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBuYW1lICsgXCJDYWxsYmFja1wiKSxcbiAgICAgICAgICAgIGxhc3RWYWx1ZTogJHRoaXMudmFsKCksXG4gICAgICAgICAgICBsYXN0VmFsaWQ6IHRydWUsXG4gICAgICAgICAgICBsYXN0RmluaXNoZWQ6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKCR0aGlzLCB2YWx1ZSwgdmFsaWRhdG9yKSB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRvci5sYXN0VmFsdWUgPT09IHZhbHVlICYmIHZhbGlkYXRvci5sYXN0RmluaXNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAhdmFsaWRhdG9yLmxhc3RWYWxpZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodmFsaWRhdG9yLmxhc3RGaW5pc2hlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWxpZGF0b3IubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB2YWxpZGF0b3IubGFzdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRvci5sYXN0RmluaXNoZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIHJyanFidlZhbGlkYXRvciA9IHZhbGlkYXRvcjtcbiAgICAgICAgICAgIHZhciBycmpxYnZUaGlzID0gJHRoaXM7XG4gICAgICAgICAgICBleGVjdXRlRnVuY3Rpb25CeU5hbWUoXG4gICAgICAgICAgICAgIHZhbGlkYXRvci5jYWxsYmFjayxcbiAgICAgICAgICAgICAgd2luZG93LFxuICAgICAgICAgICAgICAkdGhpcyxcbiAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJyanFidlZhbGlkYXRvci5sYXN0VmFsdWUgPT09IGRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHJyanFidlZhbGlkYXRvci5sYXN0VmFsaWQgPSBkYXRhLnZhbGlkO1xuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBycmpxYnZWYWxpZGF0b3IubWVzc2FnZSA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJyanFidlZhbGlkYXRvci5sYXN0RmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgcnJqcWJ2VGhpcy5kYXRhKFwidmFsaWRhdGlvblwiICsgcnJqcWJ2VmFsaWRhdG9yLnZhbGlkYXRvck5hbWUgKyBcIk1lc3NhZ2VcIiwgcnJqcWJ2VmFsaWRhdG9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgLy8gVGltZW91dCBpcyBzZXQgdG8gYXZvaWQgcHJvYmxlbXMgd2l0aCB0aGUgZXZlbnRzIGJlaW5nIGNvbnNpZGVyZWQgJ2FscmVhZHkgZmlyZWQnXG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcnJqcWJ2VGhpcy50cmlnZ2VyKFwiY2hhbmdlLnZhbGlkYXRpb25cIik7XG4gICAgICAgICAgICAgICAgICB9LCAxKTsgLy8gZG9lc24ndCBuZWVkIGEgbG9uZyB0aW1lb3V0LCBqdXN0IGxvbmcgZW5vdWdoIGZvciB0aGUgZXZlbnQgYnViYmxlIHRvIGJ1cnN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWpheDoge1xuICAgICAgICBuYW1lOiBcImFqYXhcIixcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCR0aGlzLCBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbGlkYXRvck5hbWU6IG5hbWUsXG4gICAgICAgICAgICB1cmw6ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBuYW1lICsgXCJBamF4XCIpLFxuICAgICAgICAgICAgbGFzdFZhbHVlOiAkdGhpcy52YWwoKSxcbiAgICAgICAgICAgIGxhc3RWYWxpZDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3RGaW5pc2hlZDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoJHRoaXMsIHZhbHVlLCB2YWxpZGF0b3IpIHtcbiAgICAgICAgICBpZiAoXCJcIit2YWxpZGF0b3IubGFzdFZhbHVlID09PSBcIlwiK3ZhbHVlICYmIHZhbGlkYXRvci5sYXN0RmluaXNoZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IubGFzdFZhbGlkID09PSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodmFsaWRhdG9yLmxhc3RGaW5pc2hlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWxpZGF0b3IubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB2YWxpZGF0b3IubGFzdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRvci5sYXN0RmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgIHVybDogdmFsaWRhdG9yLnVybCxcbiAgICAgICAgICAgICAgZGF0YTogXCJ2YWx1ZT1cIiArIHZhbHVlICsgXCImZmllbGQ9XCIgKyAkdGhpcy5hdHRyKFwibmFtZVwiKSxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChcIlwiK3ZhbGlkYXRvci5sYXN0VmFsdWUgPT09IFwiXCIrZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLmxhc3RWYWxpZCA9ICEhKGRhdGEudmFsaWQpO1xuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3IubWVzc2FnZSA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5sYXN0RmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIiArIHZhbGlkYXRvci52YWxpZGF0b3JOYW1lICsgXCJNZXNzYWdlXCIsIHZhbGlkYXRvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgIC8vIFRpbWVvdXQgaXMgc2V0IHRvIGF2b2lkIHByb2JsZW1zIHdpdGggdGhlIGV2ZW50cyBiZWluZyBjb25zaWRlcmVkICdhbHJlYWR5IGZpcmVkJ1xuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoXCJjaGFuZ2UudmFsaWRhdGlvblwiKTtcbiAgICAgICAgICAgICAgICAgIH0sIDEpOyAvLyBkb2Vzbid0IG5lZWQgYSBsb25nIHRpbWVvdXQsIGp1c3QgbG9uZyBlbm91Z2ggZm9yIHRoZSBldmVudCBidWJibGUgdG8gYnVyc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhaWx1cmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3IubGFzdFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3IubWVzc2FnZSA9IFwiYWpheCBjYWxsIGZhaWxlZFwiO1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvci5sYXN0RmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyB2YWxpZGF0b3IudmFsaWRhdG9yTmFtZSArIFwiTWVzc2FnZVwiLCB2YWxpZGF0b3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgLy8gVGltZW91dCBpcyBzZXQgdG8gYXZvaWQgcHJvYmxlbXMgd2l0aCB0aGUgZXZlbnRzIGJlaW5nIGNvbnNpZGVyZWQgJ2FscmVhZHkgZmlyZWQnXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwiY2hhbmdlLnZhbGlkYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfSwgMSk7IC8vIGRvZXNuJ3QgbmVlZCBhIGxvbmcgdGltZW91dCwganVzdCBsb25nIGVub3VnaCBmb3IgdGhlIGV2ZW50IGJ1YmJsZSB0byBidXJzdFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfVxuICAgICAgfSxcblx0XHRcdHJlZ2V4OiB7XG5cdFx0XHRcdG5hbWU6IFwicmVnZXhcIixcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24gKCR0aGlzLCBuYW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtyZWdleDogcmVnZXhGcm9tU3RyaW5nKCR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBuYW1lICsgXCJSZWdleFwiKSl9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2YWxpZGF0ZTogZnVuY3Rpb24gKCR0aGlzLCB2YWx1ZSwgdmFsaWRhdG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuICghdmFsaWRhdG9yLnJlZ2V4LnRlc3QodmFsdWUpICYmICEgdmFsaWRhdG9yLm5lZ2F0aXZlKVxuXHRcdFx0XHRcdFx0fHwgKHZhbGlkYXRvci5yZWdleC50ZXN0KHZhbHVlKSAmJiB2YWxpZGF0b3IubmVnYXRpdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZWQ6IHtcblx0XHRcdFx0bmFtZTogXCJyZXF1aXJlZFwiLFxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbiAoJHRoaXMsIG5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm4ge307XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZhbGlkYXRlOiBmdW5jdGlvbiAoJHRoaXMsIHZhbHVlLCB2YWxpZGF0b3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gISEodmFsdWUubGVuZ3RoID09PSAwICAmJiAhIHZhbGlkYXRvci5uZWdhdGl2ZSlcblx0XHRcdFx0XHRcdHx8ICEhKHZhbHVlLmxlbmd0aCA+IDAgJiYgdmFsaWRhdG9yLm5lZ2F0aXZlKTtcblx0XHRcdFx0fSxcbiAgICAgICAgYmxvY2tTdWJtaXQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRtYXRjaDoge1xuXHRcdFx0XHRuYW1lOiBcIm1hdGNoXCIsXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uICgkdGhpcywgbmFtZSkge1xuXHRcdFx0XHRcdHZhciBlbGVtZW50ID0gJHRoaXMucGFyZW50cyhcImZvcm1cIikuZmlyc3QoKS5maW5kKFwiW25hbWU9XFxcIlwiICsgJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIiArIG5hbWUgKyBcIk1hdGNoXCIpICsgXCJcXFwiXVwiKS5maXJzdCgpO1xuXHRcdFx0XHRcdGVsZW1lbnQuYmluZChcInZhbGlkYXRpb24udmFsaWRhdGlvblwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQkdGhpcy50cmlnZ2VyKFwiY2hhbmdlLnZhbGlkYXRpb25cIiwge3N1Ym1pdHRpbmc6IHRydWV9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4ge1wiZWxlbWVudFwiOiBlbGVtZW50fTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dmFsaWRhdGU6IGZ1bmN0aW9uICgkdGhpcywgdmFsdWUsIHZhbGlkYXRvcikge1xuXHRcdFx0XHRcdHJldHVybiAodmFsdWUgIT09IHZhbGlkYXRvci5lbGVtZW50LnZhbCgpICYmICEgdmFsaWRhdG9yLm5lZ2F0aXZlKVxuXHRcdFx0XHRcdFx0fHwgKHZhbHVlID09PSB2YWxpZGF0b3IuZWxlbWVudC52YWwoKSAmJiB2YWxpZGF0b3IubmVnYXRpdmUpO1xuXHRcdFx0XHR9LFxuICAgICAgICBibG9ja1N1Ym1pdDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdG1heDoge1xuXHRcdFx0XHRuYW1lOiBcIm1heFwiLFxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbiAoJHRoaXMsIG5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm4ge21heDogJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIiArIG5hbWUgKyBcIk1heFwiKX07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZhbGlkYXRlOiBmdW5jdGlvbiAoJHRoaXMsIHZhbHVlLCB2YWxpZGF0b3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gKHBhcnNlRmxvYXQodmFsdWUsIDEwKSA+IHBhcnNlRmxvYXQodmFsaWRhdG9yLm1heCwgMTApICYmICEgdmFsaWRhdG9yLm5lZ2F0aXZlKVxuXHRcdFx0XHRcdFx0fHwgKHBhcnNlRmxvYXQodmFsdWUsIDEwKSA8PSBwYXJzZUZsb2F0KHZhbGlkYXRvci5tYXgsIDEwKSAmJiB2YWxpZGF0b3IubmVnYXRpdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWluOiB7XG5cdFx0XHRcdG5hbWU6IFwibWluXCIsXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uICgkdGhpcywgbmFtZSkge1xuXHRcdFx0XHRcdHJldHVybiB7bWluOiAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblwiICsgbmFtZSArIFwiTWluXCIpfTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dmFsaWRhdGU6IGZ1bmN0aW9uICgkdGhpcywgdmFsdWUsIHZhbGlkYXRvcikge1xuXHRcdFx0XHRcdHJldHVybiAocGFyc2VGbG9hdCh2YWx1ZSkgPCBwYXJzZUZsb2F0KHZhbGlkYXRvci5taW4pICYmICEgdmFsaWRhdG9yLm5lZ2F0aXZlKVxuXHRcdFx0XHRcdFx0fHwgKHBhcnNlRmxvYXQodmFsdWUpID49IHBhcnNlRmxvYXQodmFsaWRhdG9yLm1pbikgJiYgdmFsaWRhdG9yLm5lZ2F0aXZlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG1heGxlbmd0aDoge1xuXHRcdFx0XHRuYW1lOiBcIm1heGxlbmd0aFwiLFxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbiAoJHRoaXMsIG5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm4ge21heGxlbmd0aDogJHRoaXMuZGF0YShcInZhbGlkYXRpb25cIiArIG5hbWUgKyBcIk1heGxlbmd0aFwiKX07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZhbGlkYXRlOiBmdW5jdGlvbiAoJHRoaXMsIHZhbHVlLCB2YWxpZGF0b3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gKCh2YWx1ZS5sZW5ndGggPiB2YWxpZGF0b3IubWF4bGVuZ3RoKSAmJiAhIHZhbGlkYXRvci5uZWdhdGl2ZSlcblx0XHRcdFx0XHRcdHx8ICgodmFsdWUubGVuZ3RoIDw9IHZhbGlkYXRvci5tYXhsZW5ndGgpICYmIHZhbGlkYXRvci5uZWdhdGl2ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRtaW5sZW5ndGg6IHtcblx0XHRcdFx0bmFtZTogXCJtaW5sZW5ndGhcIixcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24gKCR0aGlzLCBuYW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHttaW5sZW5ndGg6ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBuYW1lICsgXCJNaW5sZW5ndGhcIil9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2YWxpZGF0ZTogZnVuY3Rpb24gKCR0aGlzLCB2YWx1ZSwgdmFsaWRhdG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuICgodmFsdWUubGVuZ3RoIDwgdmFsaWRhdG9yLm1pbmxlbmd0aCkgJiYgISB2YWxpZGF0b3IubmVnYXRpdmUpXG5cdFx0XHRcdFx0XHR8fCAoKHZhbHVlLmxlbmd0aCA+PSB2YWxpZGF0b3IubWlubGVuZ3RoKSAmJiB2YWxpZGF0b3IubmVnYXRpdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWF4Y2hlY2tlZDoge1xuXHRcdFx0XHRuYW1lOiBcIm1heGNoZWNrZWRcIixcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24gKCR0aGlzLCBuYW1lKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW1lbnRzID0gJHRoaXMucGFyZW50cyhcImZvcm1cIikuZmlyc3QoKS5maW5kKFwiW25hbWU9XFxcIlwiICsgJHRoaXMuYXR0cihcIm5hbWVcIikgKyBcIlxcXCJdXCIpO1xuXHRcdFx0XHRcdGVsZW1lbnRzLmJpbmQoXCJjbGljay52YWxpZGF0aW9uXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdCR0aGlzLnRyaWdnZXIoXCJjaGFuZ2UudmFsaWRhdGlvblwiLCB7aW5jbHVkZUVtcHR5OiB0cnVlfSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIHttYXhjaGVja2VkOiAkdGhpcy5kYXRhKFwidmFsaWRhdGlvblwiICsgbmFtZSArIFwiTWF4Y2hlY2tlZFwiKSwgZWxlbWVudHM6IGVsZW1lbnRzfTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dmFsaWRhdGU6IGZ1bmN0aW9uICgkdGhpcywgdmFsdWUsIHZhbGlkYXRvcikge1xuXHRcdFx0XHRcdHJldHVybiAodmFsaWRhdG9yLmVsZW1lbnRzLmZpbHRlcihcIjpjaGVja2VkXCIpLmxlbmd0aCA+IHZhbGlkYXRvci5tYXhjaGVja2VkICYmICEgdmFsaWRhdG9yLm5lZ2F0aXZlKVxuXHRcdFx0XHRcdFx0fHwgKHZhbGlkYXRvci5lbGVtZW50cy5maWx0ZXIoXCI6Y2hlY2tlZFwiKS5sZW5ndGggPD0gdmFsaWRhdG9yLm1heGNoZWNrZWQgJiYgdmFsaWRhdG9yLm5lZ2F0aXZlKTtcblx0XHRcdFx0fSxcbiAgICAgICAgYmxvY2tTdWJtaXQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRtaW5jaGVja2VkOiB7XG5cdFx0XHRcdG5hbWU6IFwibWluY2hlY2tlZFwiLFxuXHRcdFx0XHRpbml0OiBmdW5jdGlvbiAoJHRoaXMsIG5hbWUpIHtcblx0XHRcdFx0XHR2YXIgZWxlbWVudHMgPSAkdGhpcy5wYXJlbnRzKFwiZm9ybVwiKS5maXJzdCgpLmZpbmQoXCJbbmFtZT1cXFwiXCIgKyAkdGhpcy5hdHRyKFwibmFtZVwiKSArIFwiXFxcIl1cIik7XG5cdFx0XHRcdFx0ZWxlbWVudHMuYmluZChcImNsaWNrLnZhbGlkYXRpb25cIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0JHRoaXMudHJpZ2dlcihcImNoYW5nZS52YWxpZGF0aW9uXCIsIHtpbmNsdWRlRW1wdHk6IHRydWV9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4ge21pbmNoZWNrZWQ6ICR0aGlzLmRhdGEoXCJ2YWxpZGF0aW9uXCIgKyBuYW1lICsgXCJNaW5jaGVja2VkXCIpLCBlbGVtZW50czogZWxlbWVudHN9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2YWxpZGF0ZTogZnVuY3Rpb24gKCR0aGlzLCB2YWx1ZSwgdmFsaWRhdG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuICh2YWxpZGF0b3IuZWxlbWVudHMuZmlsdGVyKFwiOmNoZWNrZWRcIikubGVuZ3RoIDwgdmFsaWRhdG9yLm1pbmNoZWNrZWQgJiYgISB2YWxpZGF0b3IubmVnYXRpdmUpXG5cdFx0XHRcdFx0XHR8fCAodmFsaWRhdG9yLmVsZW1lbnRzLmZpbHRlcihcIjpjaGVja2VkXCIpLmxlbmd0aCA+PSB2YWxpZGF0b3IubWluY2hlY2tlZCAmJiB2YWxpZGF0b3IubmVnYXRpdmUpO1xuXHRcdFx0XHR9LFxuICAgICAgICBibG9ja1N1Ym1pdDogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnVpbHRJblZhbGlkYXRvcnM6IHtcblx0XHRcdGVtYWlsOiB7XG5cdFx0XHRcdG5hbWU6IFwiRW1haWxcIixcblx0XHRcdFx0dHlwZTogXCJzaG9ydGN1dFwiLFxuXHRcdFx0XHRzaG9ydGN1dDogXCJ2YWxpZGVtYWlsXCJcblx0XHRcdH0sXG5cdFx0XHR2YWxpZGVtYWlsOiB7XG5cdFx0XHRcdG5hbWU6IFwiVmFsaWRlbWFpbFwiLFxuXHRcdFx0XHR0eXBlOiBcInJlZ2V4XCIsXG5cdFx0XHRcdHJlZ2V4OiBcIltBLVphLXowLTkuXyUrLV0rQFtBLVphLXowLTkuLV0rXFxcXFxcLltBLVphLXpdezIsNH1cIixcblx0XHRcdFx0bWVzc2FnZTogXCJOb3QgYSB2YWxpZCBlbWFpbCBhZGRyZXNzPCEtLSBkYXRhLXZhbGlkYXRvci12YWxpZGVtYWlsLW1lc3NhZ2UgdG8gb3ZlcnJpZGUgLS0+XCJcblx0XHRcdH0sXG5cdFx0XHRwYXNzd29yZGFnYWluOiB7XG5cdFx0XHRcdG5hbWU6IFwiUGFzc3dvcmRhZ2FpblwiLFxuXHRcdFx0XHR0eXBlOiBcIm1hdGNoXCIsXG5cdFx0XHRcdG1hdGNoOiBcInBhc3N3b3JkXCIsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiRG9lcyBub3QgbWF0Y2ggdGhlIGdpdmVuIHBhc3N3b3JkPCEtLSBkYXRhLXZhbGlkYXRvci1wYXN3b3JkYWdhaW4tbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIlxuXHRcdFx0fSxcblx0XHRcdHBvc2l0aXZlOiB7XG5cdFx0XHRcdG5hbWU6IFwiUG9zaXRpdmVcIixcblx0XHRcdFx0dHlwZTogXCJzaG9ydGN1dFwiLFxuXHRcdFx0XHRzaG9ydGN1dDogXCJudW1iZXIscG9zaXRpdmVudW1iZXJcIlxuXHRcdFx0fSxcblx0XHRcdG5lZ2F0aXZlOiB7XG5cdFx0XHRcdG5hbWU6IFwiTmVnYXRpdmVcIixcblx0XHRcdFx0dHlwZTogXCJzaG9ydGN1dFwiLFxuXHRcdFx0XHRzaG9ydGN1dDogXCJudW1iZXIsbmVnYXRpdmVudW1iZXJcIlxuXHRcdFx0fSxcblx0XHRcdG51bWJlcjoge1xuXHRcdFx0XHRuYW1lOiBcIk51bWJlclwiLFxuXHRcdFx0XHR0eXBlOiBcInJlZ2V4XCIsXG5cdFx0XHRcdHJlZ2V4OiBcIihbKy1dP1xcXFxcXGQrKFxcXFxcXC5cXFxcXFxkKik/KFtlRV1bKy1dP1swLTldKyk/KT9cIixcblx0XHRcdFx0bWVzc2FnZTogXCJNdXN0IGJlIGEgbnVtYmVyPCEtLSBkYXRhLXZhbGlkYXRvci1udW1iZXItbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIlxuXHRcdFx0fSxcblx0XHRcdGludGVnZXI6IHtcblx0XHRcdFx0bmFtZTogXCJJbnRlZ2VyXCIsXG5cdFx0XHRcdHR5cGU6IFwicmVnZXhcIixcblx0XHRcdFx0cmVnZXg6IFwiWystXT9cXFxcXFxkK1wiLFxuXHRcdFx0XHRtZXNzYWdlOiBcIk5vIGRlY2ltYWwgcGxhY2VzIGFsbG93ZWQ8IS0tIGRhdGEtdmFsaWRhdG9yLWludGVnZXItbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIlxuXHRcdFx0fSxcblx0XHRcdHBvc2l0aXZlbnVtYmVyOiB7XG5cdFx0XHRcdG5hbWU6IFwiUG9zaXRpdmVudW1iZXJcIixcblx0XHRcdFx0dHlwZTogXCJtaW5cIixcblx0XHRcdFx0bWluOiAwLFxuXHRcdFx0XHRtZXNzYWdlOiBcIk11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXI8IS0tIGRhdGEtdmFsaWRhdG9yLXBvc2l0aXZlbnVtYmVyLW1lc3NhZ2UgdG8gb3ZlcnJpZGUgLS0+XCJcblx0XHRcdH0sXG5cdFx0XHRuZWdhdGl2ZW51bWJlcjoge1xuXHRcdFx0XHRuYW1lOiBcIk5lZ2F0aXZlbnVtYmVyXCIsXG5cdFx0XHRcdHR5cGU6IFwibWF4XCIsXG5cdFx0XHRcdG1heDogMCxcblx0XHRcdFx0bWVzc2FnZTogXCJNdXN0IGJlIGEgbmVnYXRpdmUgbnVtYmVyPCEtLSBkYXRhLXZhbGlkYXRvci1uZWdhdGl2ZW51bWJlci1tZXNzYWdlIHRvIG92ZXJyaWRlIC0tPlwiXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZWQ6IHtcblx0XHRcdFx0bmFtZTogXCJSZXF1aXJlZFwiLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVpcmVkXCIsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiVGhpcyBpcyByZXF1aXJlZDwhLS0gZGF0YS12YWxpZGF0b3ItcmVxdWlyZWQtbWVzc2FnZSB0byBvdmVycmlkZSAtLT5cIlxuXHRcdFx0fSxcblx0XHRcdGNoZWNrb25lOiB7XG5cdFx0XHRcdG5hbWU6IFwiQ2hlY2tvbmVcIixcblx0XHRcdFx0dHlwZTogXCJtaW5jaGVja2VkXCIsXG5cdFx0XHRcdG1pbmNoZWNrZWQ6IDEsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiQ2hlY2sgYXQgbGVhc3Qgb25lIG9wdGlvbjwhLS0gZGF0YS12YWxpZGF0aW9uLWNoZWNrb25lLW1lc3NhZ2UgdG8gb3ZlcnJpZGUgLS0+XCJcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIGZvcm1hdFZhbGlkYXRvck5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdHJldHVybiBuYW1lXG5cdFx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdFx0LnJlcGxhY2UoXG5cdFx0XHRcdC8oXnxcXHMpKFthLXpdKS9nICxcblx0XHRcdFx0ZnVuY3Rpb24obSxwMSxwMikge1xuXHRcdFx0XHRcdHJldHVybiBwMStwMi50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0O1xuXHR9O1xuXG5cdHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uICgkdGhpcykge1xuXHRcdC8vIEV4dHJhY3QgdGhlIHZhbHVlIHdlJ3JlIHRhbGtpbmcgYWJvdXRcblx0XHR2YXIgdmFsdWUgPSAkdGhpcy52YWwoKTtcblx0XHR2YXIgdHlwZSA9ICR0aGlzLmF0dHIoXCJ0eXBlXCIpO1xuXHRcdGlmICh0eXBlID09PSBcImNoZWNrYm94XCIpIHtcblx0XHRcdHZhbHVlID0gKCR0aGlzLmlzKFwiOmNoZWNrZWRcIikgPyB2YWx1ZSA6IFwiXCIpO1xuXHRcdH1cblx0XHRpZiAodHlwZSA9PT0gXCJyYWRpb1wiKSB7XG5cdFx0XHR2YWx1ZSA9ICgkKCdpbnB1dFtuYW1lPVwiJyArICR0aGlzLmF0dHIoXCJuYW1lXCIpICsgJ1wiXTpjaGVja2VkJykubGVuZ3RoID4gMCA/IHZhbHVlIDogXCJcIik7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblxuICBmdW5jdGlvbiByZWdleEZyb21TdHJpbmcoaW5wdXRzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IFJlZ0V4cChcIl5cIiArIGlucHV0c3RyaW5nICsgXCIkXCIpO1xuXHR9XG5cbiAgLyoqXG4gICAqIFRoYW5rcyB0byBKYXNvbiBCdW50aW5nIHZpYSBTdGFja092ZXJmbG93LmNvbVxuICAgKlxuICAgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1OTc4OC9ob3ctdG8tZXhlY3V0ZS1hLWphdmFzY3JpcHQtZnVuY3Rpb24td2hlbi1pLWhhdmUtaXRzLW5hbWUtYXMtYS1zdHJpbmcjYW5zd2VyLTM1OTkxMFxuICAgKiBTaG9ydCBsaW5rOiBodHRwOi8vdGlueXVybC5jb20vZXhlY3V0ZUZ1bmN0aW9uQnlOYW1lXG4gICoqL1xuICBmdW5jdGlvbiBleGVjdXRlRnVuY3Rpb25CeU5hbWUoZnVuY3Rpb25OYW1lLCBjb250ZXh0IC8qLCBhcmdzKi8pIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc3BsaWNlKDIpO1xuICAgIHZhciBuYW1lc3BhY2VzID0gZnVuY3Rpb25OYW1lLnNwbGl0KFwiLlwiKTtcbiAgICB2YXIgZnVuYyA9IG5hbWVzcGFjZXMucG9wKCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG5hbWVzcGFjZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0W25hbWVzcGFjZXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dFtmdW5jXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG5cdCQuZm4uanFCb290c3RyYXBWYWxpZGF0aW9uID0gZnVuY3Rpb24oIG1ldGhvZCApIHtcblxuXHRcdGlmICggZGVmYXVsdHMubWV0aG9kc1ttZXRob2RdICkge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRzLm1ldGhvZHNbbWV0aG9kXS5hcHBseSggdGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApKTtcblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhIG1ldGhvZCApIHtcblx0XHRcdHJldHVybiBkZWZhdWx0cy5tZXRob2RzLmluaXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0JC5lcnJvciggJ01ldGhvZCAnICsgIG1ldGhvZCArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LmpxQm9vdHN0cmFwVmFsaWRhdGlvbicgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHR9O1xuXG4gICQuanFCb290c3RyYXBWYWxpZGF0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAkKFwiOmlucHV0XCIpLm5vdChcIlt0eXBlPWltYWdlXSxbdHlwZT1zdWJtaXRdXCIpLmpxQm9vdHN0cmFwVmFsaWRhdGlvbi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG4gIH07XG5cbn0pKCBqUXVlcnkgKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
