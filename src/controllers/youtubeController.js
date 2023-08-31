import asyncHandler from 'express-async-handler'
import Employee from '../Models/employeeModel.js'
import { v4 as uuidv4 } from 'uuid';




/// fetching all employee
/// public route
/// api/employee
export const handleYoutube= ('/',  asyncHandler(async (req, res)=> {
   console.log('worked');
}))
