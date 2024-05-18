import { db, collection, doc, updateDoc, increment,deleteDoc, query, where,getDocs } from "@/Firebase/Index"


export const reservationReturnedOrCanceled = async(reservation) => {
    const Serialseries = reservation.ItemSerials
    const Serialnumbers = reservation.allItemSerials
    const itemnames = reservation.allItemNames
    console.log(Serialseries)
    let itemdoc = 0
    for (let serialserie of Serialseries) {
        for (let serialnumber of Serialnumbers.filter((serial) => serial.split("-")[0] === serialserie)) {
            let cref = collection(db, `Utility/Reservations/All Reservations`)
            let q = query(cref, where("allItemSerials", "array-contains-any", [serialnumber])) 
            let snapshot = await getDocs(q)
            if(snapshot.size === 1) {
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
            }
            itemdoc++
        }
    }
    await deleteDoc(doc(db, `Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Users/${reservation.userid}/Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Utility/Reservations/All Reservations/${reservation.id}`))
}