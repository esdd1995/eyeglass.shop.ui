(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    $(document).ready(function () {
        // Toggle the display of "#droplenz" when the link is clicked
        $('#filter-link').click(function (e) {
            e.preventDefault();
            $('#filter').toggle();
        });

    });
    $(document).ready(function () {
        var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints; // Check if it's a touch device
        var timeout;
        var activeElement = null;
        var isMouseInside = false;

        // Function to show the element as a dialog and set z-index for children
        function showDialog(elementId) {
            $('#' + elementId).css({
                'display': 'block',
                'position': 'fixed', // Set the position to 'fixed'
                'z-index': 1000, // Adjust the z-index as needed to appear above other elements
                'pointer-events': 'auto' // Enable pointer events for elements inside the dialog
            }).children().css('z-index', 1000); // Set z-index for children
        }

        // Function to hide the element and reset z-index for children
        function hideElement(elementId) {
            $('#' + elementId).css({
                'display': 'none',
                'pointer-events': 'none' // Disable pointer events for the dialog
            }).children().css('z-index', 'auto'); // Reset z-index for children
        }

        // Function to handle mouseenter/mouseleave events for links and the dialog container
        function handleMouseEvents(linkId, elementId) {
            $('#' + linkId + ', #' + elementId).mouseenter(function () {
                clearTimeout(timeout);
                isMouseInside = true;
                if (activeElement !== elementId) {
                    hideElement(activeElement); // Hide the previous dialog if any
                    showDialog(elementId);
                    activeElement = elementId;
                }
            });

            $('#' + linkId + ', #' + elementId).mouseleave(function () {
                isMouseInside = false;
                timeout = setTimeout(function () {
                    if (!isMouseInside) {
                        hideElement(elementId);
                        activeElement = null;
                    }
                }, 500); // Adjust the delay as needed
            });
        }

        // Call the functions for each link and element
        handleMouseEvents('droplenz-link', 'droplenz');
        handleMouseEvents('dropsun-link', 'dropsun');
        handleMouseEvents('tamasi-link', 'tamasi');
        handleMouseEvents('adasi-link', 'adasi');
        // Add more links and elements as needed

        // Mouseenter/mouseleave for non-touch devices
        if (!isTouchDevice) {
            $('#droplenz-link, #dropsun-link, #tamasi-link, #adasi-link').mouseenter(function () {
                clearTimeout(timeout);
                var elementId = $(this).attr('id').replace('-link', '');
                showElement(elementId);
            });

            $('#droplenz, #dropsun, #tamasi, #adasi').mouseenter(function () {
                clearTimeout(timeout);
            });

            $('#droplenz-link, #dropsun-link, #tamasi-link, #adasi-link').mouseleave(function () {
                var elementId = $(this).attr('id').replace('-link', '');
                timeout = setTimeout(function () {
                    hideElement(elementId);
                }, 500); // Adjust the delay as needed
            });

            $('#droplenz, #dropsun, #tamasi, #adasi').mouseleave(function () {
                timeout = setTimeout(function () {
                    hideElement('droplenz');
                    hideElement('dropsun');
                    hideElement('tamasi');
                    hideElement('adasi');
                }, 500); // Adjust the delay as needed
            });
        }
    });
    $(document).ready(function () {
        // Function to move the indicator to the target element
        function moveIndicator(targetElement) {
            const indicator = $('#nav-indicator');
            const targetPosition = targetElement.position().left;
            const targetWidth = targetElement.outerWidth();
            
            indicator.css({
                'left': targetPosition + 'px',
                'width': targetWidth + 'px',
            });
        }
    
        // Handle hover events for indicator-target class
        $('.indicator-target').on({
            mouseenter: function () {
                moveIndicator($(this));
            },
            touchstart: function () {
                moveIndicator($(this));
            },
            mouseleave: function () {
                // Handle mouseleave if needed
            }
        });
    
        // Initialize the indicator under the active nav item
        moveIndicator($('.nav-item.nav-link.active'));
    });
    

    //faq
    const questions = document.getElementsByClassName('accordion-title')//Gets all the questions (plus icon)

    for (const question of questions) {
        const answer = question.parentElement.querySelector('.accordion-content')
        const remove = question.parentElement.querySelector(".remove")
        const add = question.parentElement.querySelector(".add")
        let open = false //Variable to check if the answer is visible or not

        function openAnswer() {
            if (open == true) { //If you click the question while the answer is visible it will stop being visible and open will change it's value to false
                add.style.display = "block";
                remove.style.display = "none";
                answer.style.overflow = "hidden";
                answer.style.maxHeight = '0';
                open = false;
            } else { //If you click the question while the answer is not visible it will start being visible and open will change it's value to true
                add.style.display = "none";
                remove.style.display = "block";
                answer.style.maxHeight = "300px";
                answer.style.overflow = "visible";
                open = true;
            }
        }

        question.addEventListener('click', openAnswer)
    }
    // Header carousel
    $(document).ready(function () {
        $(".header-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            items: 1,
            rtl: true,
            dots: true,
            loop: true,
            nav: false,
        });
    });


    // Testimonials carousel
    $(document).ready(function () {
        setTimeout(() => {

        }, 5000);

    });

    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


})(jQuery);

