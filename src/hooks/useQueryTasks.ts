import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Fail, Task } from '../types'
import { useError } from '../hooks/useError'

export const useQueryTasks = () => {
  const { switchErrorHandling } = useError()

  const getTasks = async () => {
    const response = await axios.get<Task[]>(
      `${import.meta.env.VITE_REACT_APP_API_URL}/tasks`,
      { withCredentials: true }
    )
    return response.data
  }

  const { data, error, isLoading } = useQuery<Task[], Fail>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: Infinity,
  })

  // ローディング中の場合
  if (isLoading) {
    // ローディング中のUIを返す
    return { isLoading: true }
  }

  // エラーがある場合
  if (error) {
    // エラーハンドリングを実行
    if (typeof error.response.data !== 'string') {
      switchErrorHandling(error.response.data.message)
    } else {
      switchErrorHandling(error.response.data)
    }
    // エラーを返す
    return { error }
  }

  // データを返す
  return { data }
}
