import { useEffect, useState } from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import {db} from '../firebase.config'
import {updateDoc, doc} from 'firebase/firestore'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const navigate = useNavigate()
  const {name, email} = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async() => {
    try{
      if(auth.currentUser.displayName !== name){
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName:name
        })

        //Update in firestore by creating a reference
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }

    }catch(error){
      toast.error('Could not update Profile Details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  
  return (
    <div className="header">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className="logOut" onClick={onLogout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails? 'done':'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input type='text' 
            id='name'
            className={!changeDetails? 'profileName': 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
            />
            <input type='text' 
            id='email'
            className='profileEmail'
            disabled={true}
            value={email}
            onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home'/>
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right'/>
        </Link>
      </main>
    </div>
  )
}

export default Profile