import React, { Component, Fragment } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
import { QuizMarvel } from '../quizMarvel'
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa'

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisabled: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg:false,
  quizEnd: false,
  percent: null
}

const levelNames = ["debutant", "confirme", "expert"]

class Quiz extends Component {

    constructor(props) {
      super(props)      
      this.state = initialState;
      this.storedDataRef = React.createRef()
    }
    
    loadQuestions = (level) => {
      const fetchedArrayQuiz = QuizMarvel[0].quizz[level]
      if (fetchedArrayQuiz.length >= this.state.maxQuestions){
        this.storedDataRef.current = fetchedArrayQuiz
        const newArray = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest)
        this.setState({
          storedQuestions: newArray
        })
      } else {

      }
    }

    showToastMsg = pseudo => {
      if(!this.state.showWelcomeMsg){
        this.setState({
          showWelcomeMsg:true
        })
        toast(`Bienvenue ${pseudo}, et bonne chance!`)
      }
      
        
      
    }
    componentDidMount() { 
      this.loadQuestions(levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState) { 
      const {
        maxQuestions,
        storedQuestions,
        idQuestion,
        score,
        quizEnd,
        } = this.state
      if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {
        this.setState({
          question:storedQuestions[idQuestion].question,
          options:storedQuestions[idQuestion].options,
          
        })
      } else {
        console.log('pas de question')
      }

      if ((idQuestion !== prevState.idQuestion ) && storedQuestions.length) {
        this.setState({
          question:storedQuestions[idQuestion].question,
          options:storedQuestions[idQuestion].options,
          userAnswer:null,
          btnDisabled: true
        })
      } 
      if ( quizEnd !== prevState.quizEnd){
        const gradepercent = this.getPercentage(maxQuestions, score)
        this.gameOver(gradepercent)
      }
      if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
        this.showToastMsg(this.props.userData.pseudo)
        
      }
    } 

    nextQuestion = () => {
      if (this.state.idQuestion === this.state.maxQuestions - 1) {
       //this.gameOver()
       this.setState({
        quizEnd: true
       })
      } else {
        this.setState(prevState => ({
          idQuestion: prevState.idQuestion + 1
        }))
      }
      const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer
      if (this.state.userAnswer === goodAnswer) {
        this.setState(prevState => ({
          score: prevState.score + 1
        }))
        toast.success('Bravo +1')
      } else {
        toast.error('Raté 0')
      }
    }

    submitAnswer = (selectedAnswer) => {
      this.setState({
        userAnswer: selectedAnswer,
        btnDisabled: false,

      })
    }

    getPercentage = (maxQuest, ourScore) => (ourScore/maxQuest) * 100

    gameOver = (percent) => {

      

      if(percent >= 50) {
        this.setState({
          quizLevel: this.state.quizLevel + 1,
          percent
          
        })
      } else {
        this.setState({
          percent
          
        })
      }
     
    }

    loadLevelQuestions = param => {
      this.setState({...initialState, quizLevel: param})
      this.loadQuestions(levelNames[param])
    }
    render(){

      const {
        quizLevel,
        maxQuestions,
        question,
        options,
        idQuestion,
        btnDisabled,
        userAnswer,
        score,
        quizEnd,
        percent
        } = this.state

    //const {pseudo} = this.props.userData
      const displayOptions =options.map((option, index) => {
        return (
          <p key={index} 
            className={`answerOptions ${userAnswer ===  option ? 'selected' : null}`} 
            onClick={() => this.submitAnswer(option)} 
          >
            <FaChevronRight />
              {option}
          </p>
        )
      })

    return quizEnd ? (
      <QuizOver 
        ref={this.storedDataRef}
        levelNames={levelNames}
        score={score}
        maxQuestions={maxQuestions}
        quizLevel={quizLevel}
        percent={percent}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ) 
    : 
    (
      <Fragment>
          
          <Levels 
            levelNames={levelNames}
            quizLevel={quizLevel}
          />
          <ProgressBar 
            idQuestion={idQuestion} 
            maxQuestions={maxQuestions}
            />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme='light'
          />
          <h2>{question}</h2>
          {displayOptions}
          <button 
          className='btnSubmit' 
          disabled={btnDisabled}
          onClick={this.nextQuestion}
          >
            {idQuestion < maxQuestions - 1 ? 'Suivant' : 'Terminer'}
            </button>
            
        </Fragment>
    )

   
  }
  
}

export default Quiz