import { showLoading,unShowLoading } from "./tripCrud"

const renderTrip = trip =>
    `
    <div class="trip">
                <div class="trip-thumbnail">
                    <img src="${trip.destination.thumbnailUrl}"></img>
                </div>
                <div class="trip-info">
                    <p>Trip to ${trip.destination.name}</p>
                    <p>Departing:${new Date(trip.date).toLocaleDateString()}</p>
                    <p><img src="https://www.weatherbit.io/static/img/icons/${trip.weather.icon}.png"></img> ${trip.weather.low_temp}℃-${trip.weather.high_temp}℃</p>
                </div>
                <div class="trip-actions">
                    <button onclick="return Client.handleEditOnTripList(${trip.id})">edit</button>
                    <button onclick="return Client.handleRemoveTrip(${trip.id})">remove</button>
                </div>
            </div>
    `

const renderTripListView = () => {
    console.log("renderTripListView")
    fetch('http://localhost:8081/trips/all')
        .then(resp => resp.json())
        .then(trips => {
            let tripsHTML
            tripsHTML = trips.length==0?
            `<p>You don't have any trip scheduled yet.</p>
            <p>Go <button onclick="return Client.renderAddTripView()">add one</button></p>`:
            trips.sort((a, b) => a.id < b.id).map(trip => renderTrip(trip)).join('')
            let tripsSectionHTML = `<section class='trips'>${tripsHTML}</section>`
            document.getElementById('container').innerHTML = tripsSectionHTML

        })
        .catch(error => console.log(`failed to renderTripListView with error ${error}`))
}


const getTripById = async id => {
    console.log( `getTripById ${id}`)
    let res = await fetch(`http://localhost:8081/trips/${id}`)
    let trip = await res.json()
    return trip
}

const deleteTripById = async id => {
    let res = await fetch(`http://localhost:8081/trips/${id}`,
        {
            method: 'DELETE'
        })
    let trips = await res.json()
    return trips
}


const handleEditOnTripList = async tripId => {
    console.log("handleEditOnTripList"+tripId)
    let trip = await getTripById(tripId)
    Client.renderEditTripView(trip)
}
const handleRemoveTrip = async tripId => {
    console.log(`deleting trip ${tripId}`)
    showLoading()
    let trips = await deleteTripById(tripId)
    renderTripListView(trips)
    unShowLoading()
}


export { renderTripListView,handleEditOnTripList,handleRemoveTrip }
