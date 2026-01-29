import axios from 'axios'
import { Course, CreateCourseInput } from './types'

const API_BASE_URL = '/api'

export const api = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`)
      return response.data
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  },

  async getCourse(id: string): Promise<Course> {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error)
      throw error
    }
  },

  async createCourse(course: CreateCourseInput): Promise<Course> {
    try {
      const response = await axios.post(`${API_BASE_URL}/courses`, course)
      return response.data
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  },

  async updateCourse(id: string, course: Partial<CreateCourseInput>): Promise<Course> {
    try {
      const response = await axios.put(`${API_BASE_URL}/courses/${id}`, course)
      return response.data
    } catch (error) {
      console.error(`Error updating course ${id}:`, error)
      throw error
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${id}`)
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error)
      throw error
    }
  }
}