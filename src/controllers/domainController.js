import asyncHandler from 'express-async-handler'
import { v4 as uuidv4 } from 'uuid';
import Domain from '../Models/domainModel.js';
import * as dns from "dns";



/// fetching domains
/// private route
/// api/domain
export const getDomain= ('/',  asyncHandler(async (req, res)=> {
    if (req.user.role==='admin') {
      try {
        const domains= await Domain.find()

    res.json(domains)
        
    } catch (error) {
        res.json( error.message)
    }
    }else{
      try {
        const domains= await Domain.find({'ownerid': req.user._id})

    res.json(domains)
        
    } catch (error) {
        res.json( error.message)
    }
    }
}))


/// add new domain
/// private route
/// api/domain/add
export const createDomain= ('/add', asyncHandler(async (req, res)=>{
    const {
      domainName,
      
    } = req.body;
    let txtrecord= uuidv4();
    const domain = new Domain({
       ownerid: req.user._id,
       domainName,
       txtrecord
        
      })
  
    const domainDone= await domain.save()

    if (domainDone) {
        res.json(domainDone)
        
    }
    else {
        res.status(404)
        throw new Error('Problem with creating domain')
    }


}))

export const addPrimaryDomain= async(ownerid, domainName)=>{
    
    let txtrecord= uuidv4();
    // const domainexist= await Domain.find({'domainName': domainName})
    // if (domainexist.length>0) {
    //     return
    // }
    const domain = new Domain({
       ownerid,
       domainName,
       isPrimaryDomain: true,
       txtrecord
        
      })
  
    const domainDone= await domain.save()

    if (domainDone) {
        return true
        
    }
    else {
        return false
    }
}


/// update domain 
/// private route
/// api/domain/update/:id
export const updateDomain = ("/update/:id", asyncHandler(async (req, res) => {

    try {
      const domain = await Domain.findOneAndUpdate({_id:req.params.id}, {isVerifyReqSent: true});
    if (domain) {

      dns.resolveTxt(domain.domainName, async (err, addresses) => {
        const checkDNS= addresses.filter(e=>{
          return e.includes(domain.txtrecord) 
        })

        if (checkDNS.length>0) {
          const domain = await Domain.findOneAndUpdate({_id:req.params.id}, {isVerified: true});

          
      res.json({success: true, message:'DNS TXT verify successfull!'});
        }else{res.json({success: true, message:'TXT record not found! Please try again after 15 minutes'});}
    });
     
    } else {
      res.status(500);
      throw new Error("Internal error");
    }
    } catch (error) {
      res.status(404);
      res.json({success: false, message:'domain not found'})
    }
  }));

/// delete domain 
/// private route
/// api/domain/delete/:id
export const deleteDomain =
  ("/delete/:id",
  asyncHandler(async (req, res) => {
    const domain = await Domain.deleteOne({_id:req.params.id});
   
    if (domain.deletedCount !==0 ) {
      res.json({success: true, message:'domain deleted successfully'});
    } else {
      res.status(404);
      throw new Error("domain Not Found...");
    }
  }));

