import { db, collection, doc, updateDoc, increment,deleteDoc, query, where,getDocs } from "@/Firebase/Index"
import { storage,getDownloadURL,ref } from "@/Firebase/Index"

export const reservationReturnedOrCanceled = async(reservation,warning) => {
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
    await deleteDoc(doc(db, `Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Users/${reservation.userid}/Reservations/${reservation.id}`))
    await deleteDoc(doc(db, `Utility/Reservations/All Reservations/${reservation.id}`))

}
export const imageGetter = async (image) =>{
    const imageref = ref(storage, `${image}`);
    console.log(imageref)
    try{
        const url = await getDownloadURL(imageref);
        return url;
    }catch(error){
        console.log(error);
    }
}
export const generateSubstrings = (str) => {
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