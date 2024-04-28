import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useStore from '../store'
import { Credential, Fail } from '../types'
import { useError } from './useError'

export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const { switchErrorHandling } = useError()
  const loginMutation = useMutation<void, Fail, Credential>({
    mutationFn: async (user: Credential) =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, user),
    onSuccess: () => navigate('/todo'),
    onError: (err: Fail) => {
      if (typeof err.response.data !== 'string') {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
  const registerMutation = useMutation({
    mutationFn: async (user: Credential) =>
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/signup`,
        user
      ),
    onError: (err: Fail) => {
      if (typeof err.response.data !== 'string') {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
  const logoutMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/logout`),
    onSuccess: () => {
      resetEditedTask()
      navigate('/')
    },
    onError: (err: Fail) => {
      if (typeof err.response.data !== 'string') {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
  return { loginMutation, registerMutation, logoutMutation }
}
