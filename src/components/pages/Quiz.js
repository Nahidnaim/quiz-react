// import components
import Answers from "../Answers";
import ProgressBar from "../ProgressBar";
import MiniPlayer from "../MiniPlayer";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import useQuestions from "../../hooks/useQuestions";
import _ from 'lodash'
import {useAuth} from "../../contexts/AuthContext";
import {getDatabase, ref, set} from "firebase/database";
import { useLocation } from "react-router-dom";

const initialState = null;
const reducer = (state, action) => {
    switch (action.type){
        case "questions":
            action.value.forEach((question) => {
                question.options.forEach((option) => {
                    option.checked = false
                })
            })
            return action.value;
        case "answer":
            const questions = _.cloneDeep(state)
            questions[action.questionID].options[action.optionIndex].checked = action.value
            return questions;
        default:
            return state
    }
}

export default function Quiz() {
    let navigate = useNavigate()
    const {id} = useParams()
    const {loading, error, questions} = useQuestions(id)
    const [currentQuestion, setCurrentQuestion] = useState(0)

    const [qna, dispatch] = useReducer(reducer, initialState)
    const {currentUser}  = useAuth()
    const stateData = useLocation()
    const {state} = stateData
    const {videoTitle} = state

    console.log(state)
    console.log(videoTitle)

    useEffect(() => {
        dispatch({
            type: "questions",
            value: questions,
        })
    }, [questions])

    function handleAnswerChange(e, index){
        dispatch({
            type: "answer",
            questionID: currentQuestion,
            optionIndex: index,
            value: e.target.checked
        })
    }

    // handle next question
    function nextQuestion(){
        if(currentQuestion + 1 < questions.length){
            setCurrentQuestion(prevCurrent => prevCurrent + 1 )
        }
    }
    // handle prev question
    function prevQuestion(){
        if(currentQuestion >= 1 && currentQuestion <= questions.length){
            setCurrentQuestion(prevCurrent => prevCurrent - 1 )
        }
    }

    // submit and redirect to result
    async function submit(){
        const {uid} = currentUser

        const db = getDatabase()
        const resultRef = ref(db, `result/${uid}`)

        await set(resultRef, {
            [id]: qna
        })
        navigate(`/result/${id}`, {state: {qna}})
    }

    // calculate percentage of progress
    const percentage = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
        {loading && <div>Loading...</div>}
        {error && <div>There was an error</div>}
        {!loading && !error && qna && qna.length > 0 && (
            <>
                <h1>{qna[currentQuestion].title}</h1>
                <h4>Question can have multiple answers</h4>
                <Answers
                    input
                    options={qna[currentQuestion].options}
                    handleChange={handleAnswerChange}
                />
                <ProgressBar
                    next={nextQuestion}
                    prev={prevQuestion}
                    submit={submit}
                    progress={percentage}
                />
                <MiniPlayer id={id} title={videoTitle} />
            </>
        )}
    </>
  );
}
