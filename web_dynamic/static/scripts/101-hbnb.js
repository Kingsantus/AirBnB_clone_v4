#!/usr/bin/node
// Script that helps to display the amenities
$(document).ready(function () {
    var amenityIds = {};

    function updateAmenitiesList() {
        var checkedAmenities = Object.values(:amenity_Id);
        var amenitiesString = checkedAmenities.join(', ');
        $('.amenities h4').text(amenitiesString);
    }

    function updateLocationsList() {
        var checkedLocations = Object.values(:state_id);
        var locationsString = checkedLocations.join(', ');
        $('.locations h4').text(locationsString);
    }

    function checkAPIStatus() {    
	    $.ajax({
		    url: 'http://0.0.0.0:5001/api/v1/status/',
		    type: 'GET',
		    success: function (data) {
			    if (data.status === 'OK') {
				    $('#api_status').addClass('available');
			    } else {
				    $('#api_status').removeClass('available');
			    }
		    },
		    error: function () {
			    $('#api_status').removeClass('available');
		    }
	    });
    }

    function places_search() {
	    var searchData = {
            amenities: Object.values(:amenity_id),
            cities: Object.values(:city_id),
            states: Object.values(:state_id)
	    }
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(searchData),
            success: function (places) {
                $('.places article').remove();

                places.forEach(function (place) {
                    var article = $('<article>');
                    var titleBox = $('<div class="title_box">');
                    titleBox.append('<h2>' + place.name + '</h2>');
                    titleBox.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
                    article.append(titleBox);
                    var information = $('<div class="information">');
                    information.append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
                    information.append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
                    information.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');
                    article.append(information);
                    article.append('<div class="description">' + place.description + '</div>');

                    $('.places').append(article);
                });
            },
            error: function (error) {
                console.error('Error sending places search request:', error);
            }
        });
    }
    places_search()

    checkAPIStatus();
     function fetchAndDisplayReviews() {
        var reviewsList = $('.reviews-list');
        var showSpan = $('.reviews h2 .show');

        if (showSpan.text() === 'show') {
            // Fetch and display reviews
            $.ajax({
                url: 'http://0.0.0.0:5001/api/v1/review',
                type: 'GET',
                success: function (reviews) {
                    reviewsList.empty();
                    reviews.forEach(function (review) {
                        var li = $('<li>');
                        li.append('<h3>' + review.user + ' the ' + review.date + '</h3>');
                        li.append('<p>' + review.text + '</p>');
                        reviewsList.append(li);
                    });
                },
                error: function (error) {
                    console.error('Error fetching reviews:', error);
                }
            });

            showSpan.text('hide');
        } else {
            reviewsList.empty();
            showSpan.text('show');
        }
    }

    $('button').click(function () {
        places_search();
    });

    $('input[type="checkbox"]').change(function () {
        var amenityId = $(this).data('id');
        var amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            amenityIds[amenityId] = amenityName;
        } else {
            delete amenityIds[amenityId];
        }

        updateAmenitiesList();
    });
    $('.reviews h2 .show').click(function () {
        fetchAndDisplayReviews();
    });
});

