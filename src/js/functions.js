import { db, collection, doc, updateDoc, increment,deleteDoc } from "@/Firebase/Index"


export const reservationReturnedOrCanceled = async(reservation) => {
    const Serialseries = reservation.ItemSerials
    const Serialnumbers = reservation.allItemSerials
    const itemnames = reservation.allItemNames
    console.log(Serialseries)
    let itemdoc = 0
    for (let serialserie of Serialseries) {
        for (let serialnumber of Serialnumbers.filter((serial) => serial.split("-")[0] === serialserie)) {
            await updateDoc(doc(db, `Items/${itemnames[itemdoc].charAt(0).toUpperCase() 
                + itemnames[itemdoc].slice(1)}/${itemnames[itemdoc].charAt(0).toUpperCase() 
                + itemnames[itemdoc].slice(1)} items/${serialnumber}`), {
               Reserved: false
            }).then(
                updateDoc(doc(db, `Items/${itemnames[itemdoc].charAt(0).toUpperCase() 
                    + itemnames[itemdoc].slice(1)}`), {
                   AvailableAmount: increment(1)
                })
            )
            itemdoc++
        }
    }
    deleteDoc(doc(db, `Reservations/Tester ${reservation.StartDate} ${reservation.EndDate}`))
}