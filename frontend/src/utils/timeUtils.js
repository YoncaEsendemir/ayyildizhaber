import React , {useEffect,useState} from 'react'

export const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

export const useTime = () => {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return time
} 