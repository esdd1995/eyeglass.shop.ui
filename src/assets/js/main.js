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
        $('#droplenz-link').click(function (e) {
            e.preventDefault();
            $('#droplenz').toggle();
        });
    });
    $(document).ready(function () {
        // Toggle the display of "#droplenz" when the link is clicked
        $('#dropsun-link').click(function (e) {
            e.preventDefault();
            $('#dropsun').toggle();
        });

    });
    $(document).ready(function () {
        // Toggle the display of "#droplenz" when the link is clicked
        $('#tamasi-link').click(function (e) {
            e.preventDefault();
            $('#tamasi').toggle();
        });
    });
    $(document).ready(function () {
        // Toggle the display of "#droplenz" when the link is clicked
        $('#adasi-link').click(function (e) {
            e.preventDefault();
            $('#adasi').toggle();
        });

    });

    $(document).ready(function () {
        // Toggle the display of "#droplenz" when the link is clicked
        $('#filter-link').click(function (e) {
            e.preventDefault();
            $('#filter').toggle();
        });

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

