$(document).ready(function() {
    // display the current date
    displayCurrentDate();

    // add classes and elements to the time blocks
    addClassesAndElements();

    // color-code the middle column based on past, present, future
    colorCodeMiddleColumn();

    // event listener for clicking on a time block to enter an event and saving the event to local storage
    $('.time-block').on('click', function() {
        $(this).attr('contenteditable', 'true'); // Make the time block editable

        // save the event to local storage when the time block loses focus
        $(this).on('blur', function() {
            let timeBlockId = $(this).closest('.row').attr('id');
            let eventText = $(this).text();
            localStorage.setItem(timeBlockId, eventText);

            // populate the saved event data only in the current time block
            $(this).text(eventText);
        });
    });

    // assign unique IDs to time block elements and populate saved events
    $('.row').each(function(index) {
        let uniqueId = `timeBlock-${index + 1}`;
        $(this).attr('id', uniqueId);

        let savedEvent = localStorage.getItem(uniqueId);
        if (savedEvent) {
            $(this).find('.col-10').text(savedEvent);
        }
    });
});
// display date
function displayCurrentDate() {
    const currentDate = new Date();
    const formattedDate = dayjs(currentDate).format('dddd, MMMM D, YYYY');
    $('#currentDay').text(formattedDate);
}
// add classes 
function addClassesAndElements() {
    $('.row').each(function() {
        $(this).find('.col-1').addClass('hour');
        $(this).find('.col-1:nth-child(3)').append('<i class="fas fa-save"></i>').addClass('saveBtn');
        $(this).find('.col-10').addClass('time-block');
    });
}
// change color of block-time
function colorCodeMiddleColumn() {
    var currentHour = dayjs().hour();

    $('.row').each(function() {
        $(this).find('.col-10').each(function() {
            var blockTime = $(this).prev().text();
            var blockHour24h = parseInt(convertHour12to24(blockTime));

            if (blockHour24h < currentHour) {
                $(this).addClass('past');
            } else if (blockHour24h === currentHour) {
                $(this).addClass('present');
            } else {
                $(this).addClass('future');
            }
        });
    });
}
// convert am/pm to 24h
function convertHour12to24(time12h) {
    let [hours, modifier] = time12h.match(/(\d+|PM|AM)/gi);
    if (hours === '12') {
        hours = '00';
    }
    if (modifier.toUpperCase() === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours}`;
}
// localStorage.clear();