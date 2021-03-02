import {showLoading,unShowLoading,handleSaveTrip,handleCheckTrip, renderAddTripView,renderEditTripView, validateDate } from './js/tripCrud'
import { renderTripListView,handleEditOnTripList,handleRemoveTrip } from './js/tripList'
import "./styles/resets.scss"
import "./styles/base.scss"
import "./styles/header.scss"
import "./styles/add-trip.scss"
import "./styles/edit-trip.scss"
import "./styles/trips-list.scss"
import "./styles/footer.scss"


export {
    showLoading,
    unShowLoading,
    handleCheckTrip,
    handleSaveTrip,
    validateDate,
    renderAddTripView,
    renderEditTripView,
    renderTripListView,
    handleEditOnTripList,
    handleRemoveTrip
}
