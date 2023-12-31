import React, { Fragment,useEffect, useState } from 'react'
import { GiTrophyCup } from 'react-icons/gi'
import Loader from '../Loader'
import Modal from '../Modal'
import axios from 'axios'

const QuizOver = React.forwardRef((props, ref) => {

    const {
        levelNames,
        score,
        maxQuestions,
        quizLevel,
        percent,
        loadLevelQuestions} = props


    const API_PUBLIC_KEY = 'bc7b840e24bfbcd33535630252b9f742'

    const hash = '8e5f806de80af0ba9b88377d427bad5e'

    const [asked, setAsked] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [characterInfos, setCharacterInfos] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        setAsked(ref.current)

        if(localStorage.getItem('marvelStorageDate')){
            const date = localStorage.getItem('marvelStorageDate')
            checkDataAge(date)
        }
    },[ref])

    const checkDataAge = (date) => {
        const today = Date.now()
        const timeDifference = today - date

        const daysDifference = timeDifference / (1000*3600*24)
        if (daysDifference >= 15) {
            localStorage.clear()
            localStorage.setItem('marvelStorageDate', Date.now())

        } else {
            
        }
    }
    const showModal = id =>{
        setOpenModal(true)
        console.log(id)
        if (localStorage.getItem(id)) {
            setCharacterInfos(JSON.parse(localStorage.getItem(id)))
            setLoading(false)
        } else {
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then(response => {
                
            //     console.log(API_PUBLIC_KEY)
             console.log(response)
            setCharacterInfos(response.data)
            setLoading(false)
            localStorage.setItem(id, JSON.stringify(response.data))
            if (!localStorage.getItem('marvelStorageDate')) {
                localStorage.setItem('marvelStorageDate', Date.now())
        }
            
        })
        .catch(err => {console.log(err)})
        }
        
    }

    const hideModal = () =>{
        setOpenModal(false)
        setLoading(true)
    }

    const capitalizeFirstletter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    const averageGrade = maxQuestions/2

    if (score < averageGrade) {
        //setTimeout(() =>loadLevelQuestions(0),3000)
        setTimeout(() =>loadLevelQuestions(quizLevel),3000)
    } 

    const decision = score >= averageGrade ? (
        <>
        <div className='stepsBtnContainer'>
            {
                quizLevel < levelNames.length ? 
                (
                    <>
                        <p className='successMsg'>Bravo, passez au niveau suivant! </p>
                        <button 
                            className='btnResult successMsg'
                            onClick={() =>loadLevelQuestions(quizLevel)}
                            >
                                Niveau Suivant</button>
                    </>
                )
                :
                (
                    <>
                    <p className='successMsg'>
                        <GiTrophyCup size='50px'/> Bravo, vous êtes un expert ! </p>
                    <button 
                    className='btnResult gameOver'
                    onClick={() =>loadLevelQuestions(0)}
                    >
                        Accueil</button>
                    </>

                )
            }
            


        </div>
            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent} %</div>
                <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
            
            </div>


        </>
    )
    :
    (
        <>
            <div className='stepsBtnContainer'>
                <p className='failureMsg'>Vous avez échoué</p>
            </div>

            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent} %</div>
                <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
            </div>
        </>
    )

    const questionAnswer = score >= averageGrade ? (
        asked.map(question => {
            return (
                            <tr key={question.id}>
                                <td>{question.question}</td>
                                <td>{question.answer}</td>
                                <td>
                                    <button 
                                        className='btnInfo'
                                        onClick={() => showModal(question.heroId)}
                                    >
                                        Infos</button>
                                    </td>
                            </tr>
            )
        })
    ):(
        <tr>
            
            <td colSpan="3">
                <Loader loadingMsg={'Pas de réponses!'} styling={{textAlign: 'center', color: 'red'}}/>
            </td>
        </tr>
    )

    const resultInModal = !loading ? (
        <>
        
            <div className='modalHeader'>
                <h2>{characterInfos.data.results[0].name}</h2>
            </div>
            <div className='modalBody'>
                <div className='comicImage'>
                    <img src={characterInfos.data.results[0].thumbnail.path+'.'+characterInfos.data.results[0].thumbnail.extension} 
                    alt={characterInfos.data.results[0].name}
                    />
                    <p>{characterInfos.attributionText}</p>
                </div>
                <div className='comicDetails'>
                    <h3>Description</h3>
                    {
                       characterInfos.data.results[0].description ?
                       <p>{characterInfos.data.results[0].description}</p>
                       : <p>Description indisponible...</p> 
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterInfos.data.results[0].urls &&
                        characterInfos.data.results[0].urls.map((url, index) => {
                            return <a key={index} href={url.url} target="_blank" rel='noopener noreferrer'
                            >
                                {capitalizeFirstletter(url.type)}
                                </a>
                        })
                    }
                </div>
            </div>
            <div className='modalFooter'>
                    <button className='modalBtn' onClick={hideModal}>Fermer</button>
            </div>
        </>
    ):(
        <>
        
            <div className='modalHeader'>
                <h2>Réponse de Marvel ...</h2>
            </div>
            <div className='modalBody'>
                <Loader />
            </div>
        </>
    )

    return (

        <>
        
            {decision}
            <hr />
            <p>Les réponses aux questions posées:</p>

            <div className='answerContainer'>
                <table className='answers'>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                            {questionAnswer}
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal} hideModal={hideModal}>
                
                {resultInModal}
            </Modal>
        </>
    
    )
  })

export default React.memo(QuizOver)


