const showLoading = ()=> {
    console.log("submitting form to backend...")
}

const renderResult = (data)=> {
    console.log(JSON.stringify(data))
}

const handleForm = e => {
    e.preventDefault()
    //get input 
    let destination=document.getElementById("destination").value
    let date=document.getElementById("departing-date").value
    //validate
    if (!destination) {
        alert("Please input a destination!")
        return
    }
    if (!date) {
        alert("Please input a date!")
        return
    }
    showLoading()       
    fetch(`http://localhost:8081/trip/check?destination=${destination}&date=${date}`)
    .then(res=>res.json())
    .then(data=>renderResult(data))
}



export { handleForm }

