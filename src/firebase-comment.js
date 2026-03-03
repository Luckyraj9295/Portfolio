import { getStorage } from "firebase/storage";
import { deleteDoc, doc } from "@firebase/firestore";
import { db } from "./firebase";

const storage = getStorage();

export { db, storage, deleteDoc, doc };