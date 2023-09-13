import React from 'react'

const ProgressBar = ({idQuestion, maxQuestions}) => {

  const getWidth = (totalQuestions, questionId) => {
    return (100/ totalQuestions) * questionId
  }

  
  const actualQuestion = idQuestion + 1

  const progressPercent = getWidth(maxQuestions, actualQuestion )

  return (
    <>
        <div className='percentage'>
            <div className='progressPercent'>{`Question: ${actualQuestion}/${maxQuestions}`}</div>
            <div className='progressPercent'>{`Progression: ${progressPercent}%`}</div>
        </div>
        <div className='progressBar'>
            <div className='progressBarChange' style={{width: `${progressPercent}%`}}>

            </div>
        </div>
    </>
    
  )
}

export default React.memo(ProgressBar)