const getDateDiffFromToday = date => (new Date(date).getTime() - new Date(new Date().toISOString().split("T")[0])) / (1000 * 60 * 60 * 24)
const showLoading = () => {
    document.getElementsByTagName("body")[0].classList.add("loading")
}
const unShowLoading = () => {
    document.getElementsByTagName("body")[0].classList.remove("loading")
}

const renderAddTripView = () => {
    let addTripView = `
    <section class="add" id="add-trip">
    <form action="" method="get" class="add-form" onsubmit="return Client.handleCheckTrip(event)">
    <div class="add-form-destination">
        <label for="destination">My trip to:</label>
        <input type="text" name="destination" id="destination" placeholder="Enter Destination:" requied />
    </div>
    <div class="add-form-date">
        <label for="departing-date">Departing:</label>
        <input type="date" name="departing-date" id="departing-date" requied />
    </div>
    <div class="add-form-submit">
        <input type="submit" value="Check" />
    </div>
</form>
</section>
`
    document.getElementById('container').innerHTML = addTripView
    //add date limits
    let eleDate = document.getElementById("departing-date")
    let minDate = new Date().toISOString().split("T")[0]
    let maxDate = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    eleDate.setAttribute("max", maxDate)
    eleDate.setAttribute("min", minDate)
}


const validateDate = date => {
    let msg = ''
    if (!date) {
        msg = "Please input a date"
    } else if (date == 'Invalid Date' || !new RegExp(/\d{4}-\d{2}-\d{2}/).test(date)) {
        msg = `Please input a valid date`
    } else {
        let diffInDays = getDateDiffFromToday(date)
        if (diffInDays < 0) {
            msg = "Please pick today or a future date"
        }
        if (diffInDays > 14) {
            msg = "Please pick a date within 2 weeks"
        }
    }

    return msg
}


const renderEditTripView = trip => {
    let str = JSON.stringify(trip)
    console.log(`renderEditTripView${str}`)
    const editTripView =
        `
    <section class="edit" id="edit-trip" data-id=${trip.id}>
                <div class="trip-thumbnail">
                    <img src="${trip.destination.thumbnailUrl}"></img>
                </div>
                <div class="trip-summary">
                <div class="trip-title">
                    <p>My Trip to: ${trip.destination.name}, ${trip.destination.countryName}</p>
                    <p>Departing: ${new Date(trip.date).toLocaleDateString()}</p>
                </div>

                <div class="trip-actions">
                <button id='trip-btn-save' onclick="return Client.handleSaveTrip(event)">save trip</button>
                <button id='trip-btn-remove' onclick="return Client.handleRemoveTrip(${trip.id})">remove trip</button>
                </div>

                <div class="trip-info">
                    <div class="trip-info-weather">
                        <p>The trip is ${getDateDiffFromToday(trip.date)} days away</p>
                        <p>Typical weather of ${trip.destination.name} for then is:</p>
                        <p>${trip.weather.description} High: ${trip.weather.high_temp}℃, low: ${trip.weather.low_temp}℃</p>
                    </div>
                </div>
                </div>

                <div class="trip-notes" >
                    <textarea id="trip-notes" placeholder="add trip notes here...">${trip.notes}</textarea>
                </div>
     </section>
    `
    document.getElementById("container").innerHTML = editTripView
    unShowLoading()
}


const handleCheckTrip = e => {
    e.preventDefault()
    //get input 
    let destination = document.getElementById("destination").value
    let date = document.getElementById("departing-date").value
    //validate destination
    if (!destination) {
        alert("Please input a destination")
        return
    }
    //validate date
    let msg = validateDate(date)
    if (msg && msg !== '') {
        alert(msg)
        return
    }

    //submit
    console.log("submitting trip form")
    showLoading()
    let req = {
        destination: destination,
        date: date
    }
    fetch(`http://localhost:8081/trips/new`,
        {
            method: 'POST',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        })
        .then(res => res.json())
        .then(trip => renderEditTripView(trip))
        .catch(error => {
            console.log(error)
            alert("failed to fetch trip info")
            unShowLoading()
        })
}

export const handleSaveTrip = e => {
    e.preventDefault()
    //get input 
    let id = document.getElementById("edit-trip").dataset.id
    let notes = document.getElementById("trip-notes").value
    let trip = {
        id: id,
        notes: notes
    }

    //submit
    console.log(`saving trip ${id}...`)
    showLoading()
    fetch(`http://localhost:8081/trips/${id}`,
        {
            method: 'POST',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip)
        })
        .then(res => res.json())
        .then(trips => {
            Client.renderTripListView()
            unShowLoading()
        })
        .catch(error => {
            console.log(error)
            alert("failed to save trip")
            unShowLoading()
        })
}

document.addEventListener('DOMContentLoaded', renderAddTripView())
export { handleCheckTrip, renderAddTripView, renderEditTripView, validateDate,showLoading,unShowLoading }
