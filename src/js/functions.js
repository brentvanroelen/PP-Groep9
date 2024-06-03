import { db, collection, doc, updateDoc, increment,deleteDoc, query, where,getDocs } from "@/Firebase/Index"
import { storage,getDownloadURL,ref,getDoc } from "@/Firebase/Index"
import axios from 'axios'

export const reservationReturnedOrCanceled = async(reservation,warning,email) => {
    const Serialseries = reservation.ItemSerials
    const Serialnumbers = reservation.allItemSerials
    const itemnames = reservation.allItemNames
    const uid = reservation.userid
    console.log(Serialseries)
    let itemdoc = 0
    for (let serialserie of Serialseries) {
        for (let serialnumber of Serialnumbers.filter((serial) => serial.split("-")[0] === serialserie)) {
            let cref = collection(db, `Utility/Reservations/All Reservations`)
            let q = query(cref, where("allItemSerials", "array-contains-any", [serialnumber])) 
            let snapshot = await getDocs(q)
            if(snapshot.size === 1) {
                let databaseFormat = databaseFormatter(itemnames[itemdoc])
                await updateDoc(doc(db, `Items/${databaseFormat}/${databaseFormat} items/${serialnumber}`), {
                Reserved: false
                }).then(
                    updateDoc(doc(db, `Items/${databaseFormat}`), {
                    AvailableAmount: increment(1)
                    })
                )
            }
            itemdoc++
        }
    }
    if(warning == true){
        await updateDoc(doc(db, `Users/${reservation.userid}`),{
            warningCount: increment(1)
        })
    }
    let getuser = await getDoc(doc(db, `Users/${uid}`))
    let user = getuser.data()
    if(email != false){
        await writeEmail(email,user,reservation)
    }
    await deleteDoc(doc(db, `Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Users/${reservation.userid}/Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Utility/Reservations/All Reservations/${reservation.id}`))

}
export const imageGetter = async (image) =>{
    const imageref = ref(storage, `${image}`);
    try{
        const url = await getDownloadURL(imageref);
        return url;
    }catch(error){
        console.log(error);
    }
}
export const generateSubstrings = (str) => {
    str = str.toLowerCase();
    const substrings = [];
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j <= str.length; j++) {
            substrings.push(str.substring(i, j));
        }
    }
    return substrings;
};
export const databaseFormatter = (name) =>{
    let databaseSearch;
    if(name.includes(" ")){
        let correctNameArray = []
        let namearray = name.split(" ")
        for (let partOfName of namearray){
            correctNameArray.push(partOfName.charAt(0).toUpperCase() + partOfName.slice(1))
        }
        databaseSearch = correctNameArray.join(" ")
    }else{
        databaseSearch = name.charAt(0).toUpperCase() + name.slice(1)
    }
    return databaseSearch

}
export const writeEmail = async (subject,user,reservation) => {
    const dataToSend = determinMessageValues(subject,user,reservation)
    console.log(dataToSend)
    axios.post('http://localhost:3000/mail', dataToSend)
    .then(response => {
        message.value = response.data.message
    })
    .catch(error => {
        console.log(error)
    })
}

const determinMessageValues = (type,user,reservation) => {
    console.log(type)
    console.log(user)
    console.log(reservation)
    let dataToSend = {}
    switch(type){
        case "Reminder":
            dataToSend = {
                To: `${user.email}`,
                Subject: 'Reminder for returning item',
                Message: `Dear ${user.firstName} ${user.lastName},<br> This is a reminder that the item(s) you have borrowed must be returned by tommorow. 
                Please make sure to remember that the following items are due tommorow: ${reservation.allItemSerials}. Thank you in advance and we look forward to seeing you tommorow. <br>Best Regards,<br>The Medialab Team`
            }
            break
        case "Canceled":
            dataToSend = {
                To: `${user.email}`,
                Subject: 'Reservation canceled',
                Message: `Dear ${user.firstName} ${user.lastName},<br> Due to an unforseen circumstance the medialab team has had to cancel your reservation on ${reservation.pickUpDate} for ${reservation.allItemSerials}.
                If this was priorly discussed then you may ignore this email. If this is unforseen then we are truly sorry for this inconveniance. You can inquire about further details by contacting
                gwendolyn.vander.putten@ehb.be.<br> Best Regards, <br> The Medialab Team .`
            }
            break
        case "Issue Reported":
            dataToSend = {
                To: `${user.email}`,
                Subject: 'Issue with your reservation',
                Message: `Dear ${user.firstName} ${user.lastName},<br> We are contacting you due to an issue with your reservation on ${reservation.pickUpDate} for ${reservation.allItemSerials}.
                We have come to the unfortunate conclusion that one or more of these items have a defect. We have checked alternatives but there are none available for the specified date. 
                This means that we had to cancel your reservation. We sincerely apologize for the inconvenience. If you still need the item, you are always free to place a new reservation for different dates. 
                If you have any questions or concerns please contact gwendolyn.vander.putten@ehb.be.<br>Best Regards, <br> The Medialab Team .`
            }
            break
        case "default":
            dataToSend = {
                to: '',
                subject: 'Default',
                text: 'This is a default message.',
                error: true
            }
            break
        }
    return dataToSend

}
