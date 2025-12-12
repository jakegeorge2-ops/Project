// Wait until DOM is ready
$(function () {
    // Smooth scroll to rooms section when "View rooms" button is clicked
    $("#viewRoomsBtn").on("click", function () {
        const target = $("#rooms");
        if (target.length) {
            $("html, body").animate(
                {
                    scrollTop: target.offset().top - 70, // offset for navbar
                },
                600
            );
        }
    });

    // Simple quick booking price estimate
    $("#quickBooking").on("submit", function (event) {
        event.preventDefault();

        const checkInVal = $("#checkIn").val();
        const checkOutVal = $("#checkOut").val();
        const guests = parseInt($("#guests").val(), 10);

        const resultEl = $("#bookingResult");

        if (!checkInVal || !checkOutVal || !guests) {
            resultEl
                .text("Please fill in all booking details.")
                .removeClass("text-success")
                .addClass("text-warning");
            return;
        }

        const checkIn = new Date(checkInVal);
        const checkOut = new Date(checkOutVal);

        if (checkOut <= checkIn) {
            resultEl
                .text("Check-out date must be after check-in date.")
                .removeClass("text-success")
                .addClass("text-danger");
            return;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.round((checkOut - checkIn) / msPerDay);

        // simple flat rate example
        const pricePerNight = 150;
        const total = nights * pricePerNight;

        resultEl
            .text(
                `Great choice! ${nights} night(s) for ${guests} guest(s) will be approximately €${total.toFixed(
                    2
                )}.`
            )
            .removeClass("text-warning text-danger")
            .addClass("text-success");
    });

    // Optional: show a greeting based on time of day
    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";

    // You could inject this somewhere if you want, e.g. console for now:
    console.log(`${greeting}, welcome to Azure Bay Hotel!`);
    // ---------------- ROOMS PAGE LOGIC ----------------
    if ($("#roomsFilterForm").length) {
        const $rooms = $(".room-item");
        const $typeFilter = $("#roomTypeFilter");
        const $priceFilter = $("#priceFilter");
        const $countInfo = $("#roomsCountInfo");

        function applyRoomFilters() {
            const typeVal = $typeFilter.val(); // all, sea, city, family
            const maxPrice = parseInt($priceFilter.val(), 10); // 0 = no limit
            let visibleCount = 0;

            $rooms.each(function () {
                const $room = $(this);
                const roomType = $room.data("type"); // from data-type
                const roomPrice = parseInt($room.data("price"), 10);

                let show = true;

                if (typeVal !== "all" && roomType !== typeVal) {
                    show = false;
                }

                if (maxPrice > 0 && roomPrice > maxPrice) {
                    show = false;
                }

                if (show) {
                    $room.stop(true, true).fadeIn(150);
                    visibleCount++;
                } else {
                    $room.stop(true, true).fadeOut(150);
                }
            });

            if (visibleCount === $rooms.length) {
                $countInfo.text("Showing all rooms");
            } else if (visibleCount === 0) {
                $countInfo.text("No rooms match your filters.");
            } else {
                $countInfo.text(`Showing ${visibleCount} room(s)`);
            }
        }

        // When filters change, apply filter
        $typeFilter.on("change", applyRoomFilters);
        $priceFilter.on("change", applyRoomFilters);

        // Reset button
        $("#resetFilters").on("click", function () {
            $typeFilter.val("all");
            $priceFilter.val("0");
            applyRoomFilters();
        });

        // Toggle extra details open/close
        $(".toggle-details").on("click", function () {
            const $extra = $(this).closest(".card-body").find(".room-extra");
            $extra.stop(true, true).slideToggle(180);
        });

        // Run once on page load
        applyRoomFilters();
    }
    // ---------------- ROOM DETAIL PAGE LOGIC ----------------
    if ($("#roomDetailBooking").length) {
        const pricePerNight = 180; // deluxe sea view base price

        $("#roomDetailBooking").on("submit", function (event) {
            event.preventDefault();

            const checkInVal = $("#rdCheckIn").val();
            const checkOutVal = $("#rdCheckOut").val();
            const guests = parseInt($("#rdGuests").val(), 10);
            const $result = $("#rdResult");

            if (!checkInVal || !checkOutVal || !guests) {
                $result
                    .text("Please fill in all booking details.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const checkIn = new Date(checkInVal);
            const checkOut = new Date(checkOutVal);

            if (checkOut <= checkIn) {
                $result
                    .text("Check-out date must be after check-in date.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const msPerDay = 1000 * 60 * 60 * 24;
            const nights = Math.round((checkOut - checkIn) / msPerDay);

            // Add-ons (one-off cost per stay)
            let addOns = 0;
            if ($("#addonBreakfast").is(":checked")) {
                addOns += parseFloat($("#addonBreakfast").val());
            }
            if ($("#addonSpa").is(":checked")) {
                addOns += parseFloat($("#addonSpa").val());
            }

            const baseTotal = nights * pricePerNight;
            const total = baseTotal + addOns;

            $result
                .text(
                    `Estimated price for ${nights} night(s) for ${guests} guest(s): ` +
                    `€${total.toFixed(2)} (incl. selected add-ons).`
                )
                .removeClass("text-danger")
                .addClass("text-success");
        });

        // Simple thumbnail gallery: clicking a thumb swaps the main image
        $(".room-thumb").on("click", function () {
            const newSrc = $(this).attr("src");
            const newAlt = $(this).attr("alt") || "Room photo";
            $("#roomMainImg").attr("src", newSrc).attr("alt", newAlt);
        });
    }
    // ---------------- LOGIN PAGE LOGIC ----------------
    if ($("#loginForm").length) {
        $("#loginForm").on("submit", function (event) {
            event.preventDefault();

            const email = $("#loginEmail").val().trim();
            const password = $("#loginPassword").val().trim();
            const $feedback = $("#loginFeedback");

            // basic validation
            if (!email || !password) {
                $feedback
                    .text("Please enter both your email address and password.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // very simple email pattern just for demo – not production-level
            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password.length < 6) {
                $feedback
                    .text("Password should be at least 6 characters long.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Demo "success" message (no real authentication)
            $feedback
                .text("Login successful (demo only – no real account).")
                .removeClass("text-danger")
                .addClass("text-success");
        });
    }
    // ---------------- SIGN UP PAGE LOGIC ----------------
    if ($("#signupForm").length) {
        $("#signupForm").on("submit", function (event) {
            event.preventDefault();

            const name = $("#signupName").val().trim();
            const email = $("#signupEmail").val().trim();
            const password = $("#signupPassword").val();
            const password2 = $("#signupPassword2").val();
            const termsChecked = $("#signupTerms").is(":checked");
            const $feedback = $("#signupFeedback");

            // basic required field checks
            if (!name || !email || !password || !password2) {
                $feedback
                    .text("Please fill in all fields.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // simple email pattern (demo only)
            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password.length < 6) {
                $feedback
                    .text("Password must be at least 6 characters long.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password !== password2) {
                $feedback
                    .text("Passwords do not match.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (!termsChecked) {
                $feedback
                    .text("You must agree to the terms and conditions.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Demo "success"
            $feedback
                .text("Account created successfully (demo only – not saved).")
                .removeClass("text-danger")
                .addClass("text-success");

            // Optional: clear password fields after "success"
            $("#signupPassword, #signupPassword2").val("");
        });
    }
    // ---------------- CONTACT PAGE LOGIC ----------------
    if ($("#contactForm").length) {
        $("#contactForm").on("submit", function (event) {
            event.preventDefault();

            const name = $("#contactName").val().trim();
            const email = $("#contactEmail").val().trim();
            const reason = $("#contactReason").val();
            const message = $("#contactMessage").val().trim();
            const copyRequested = $("#contactCopy").is(":checked");
            const $feedback = $("#contactFeedback");

            if (!name || !email || !reason || !message) {
                $feedback
                    .text("Please fill in all required fields.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Build a simple summary message
            let confirmText = `Thank you, ${name}. Your message has been sent.`;
            if (copyRequested) {
                confirmText += " A copy will be sent to your email (demo only).";
            }

            $feedback
                .text(confirmText)
                .removeClass("text-danger")
                .addClass("text-success");

            // Optionally clear the form (except name/email if you prefer)
            $("#contactMessage").val("");
        });
    }
  // ---------------- GALLERY PAGE LOGIC ----------------
  if ($("#galleryGrid").length) {
    const $items = $("#galleryGrid .gallery-item");
    const $buttons = $(".gallery-filters .btn");
    const $info = $("#galleryInfo");

    function updateInfo(visibleCount) {
      if (visibleCount === $items.length) {
        $info.text("Showing all photos");
      } else if (visibleCount === 0) {
        $info.text("No photos match this filter.");
      } else {
        $info.text(`Showing ${visibleCount} photo(s)`);
      }
    }

    function applyGalleryFilter(filter) {
      let visibleCount = 0;

      $items.each(function () {
        const $item = $(this);
        const category = $item.data("category");

        const show = filter === "all" || category === filter;

        if (show) {
          $item.stop(true, true).fadeIn(150);
          visibleCount++;
        } else {
          $item.stop(true, true).fadeOut(150);
        }
      });

      updateInfo(visibleCount);
    }

    // Filter buttons
    $buttons.on("click", function () {
      const filter = $(this).data("filter");

      $buttons.removeClass("active");
      $(this).addClass("active");

      applyGalleryFilter(filter);
    });

    // Lightbox / modal
    $(".gallery-img").on("click", function () {
      const src = $(this).attr("src");
      const alt = $(this).attr("alt") || "Gallery image";
      const caption = $(this).data("caption") || alt;

      $("#modalImage").attr("src", src).attr("alt", alt);
      $("#modalCaption").text(caption);

      const modalEl = document.getElementById("imageModal");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });

    // Initial state: show all
    applyGalleryFilter("all");
  }
  // ---------------- BLOG / NEWS PAGE LOGIC ----------------
  if ($("#blogList").length) {
    const $posts = $("#blogList .blog-item");
    const $category = $("#blogCategory");
    const $search = $("#blogSearch");
    const $count = $("#blogCount");

    function normalise(str) {
      return (str || "").toString().toLowerCase();
    }

    function applyBlogFilters() {
      const selectedCategory = $category.val(); // all, offers, events, news
      const searchTerm = normalise($search.val());
      let visibleCount = 0;

      $posts.each(function () {
        const $post = $(this);
        const postCategory = $post.data("category"); // from data-category
        const title = normalise($post.data("title"));
        const bodyText = normalise($post.find(".card-text").text());

        let matchesCategory =
          selectedCategory === "all" || postCategory === selectedCategory;

        let matchesSearch =
          !searchTerm ||
          title.includes(searchTerm) ||
          bodyText.includes(searchTerm);

        const show = matchesCategory && matchesSearch;

        if (show) {
          $post.stop(true, true).fadeIn(150);
          visibleCount++;
        } else {
          $post.stop(true, true).fadeOut(150);
        }
      });

      if (visibleCount === $posts.length) {
        $count.text("Showing all posts");
      } else if (visibleCount === 0) {
        $count.text("No posts match your filters.");
      } else {
        $count.text(`Showing ${visibleCount} post(s)`);
      }
    }

    // Filter when category changes
    $category.on("change", applyBlogFilters);

    // Filter when typing in search (debounced a tiny bit)
    let searchTimeout = null;
    $search.on("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyBlogFilters, 150);
    });

    // Initial state
    applyBlogFilters();
  }
  // ---------------- SINGLE BLOG POST PAGE LOGIC ----------------
  if ($("#blogArticle").length) {
    const $article = $("#blogArticle");
    const $reading = $("#readingTime");

    const text = $article.text();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200)); // ~200 wpm

    if ($reading.length) {
      $reading.text(`Approx. ${minutes} min read`);
    }
  }

});
