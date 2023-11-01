import Banner from '../models/BannerModel.js';
import fs from 'fs';

export const createBanner = async (req, res) => {
  try {
    const { name, description } = req.body;
    const banner = req.file; 

    if (banner) {
      const imageContent = fs.readFileSync(banner.path);
      const newBanner = await Banner.create({
        name,
        banner: imageContent, 
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        newBanner,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'No banner file found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error creating the banner',
    });
  }
};

// get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll(); 
  
    if (banners && banners.length > 0) {
      res.status(200).json({
        success: true,
        data: banners,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No banners found',  
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving banners',  
    });
  }
};

//get banner

export const getBannerById = async (req, res) => {
    try {
      const { bannerId } = req.params;
  
      const banner = await Banner.findByPk(bannerId);
  
      if (banner) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(banner.banner);
      } else {
        res.status(404).json({
          success: false,
          error: 'Banner not found', 
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error retrieving the banner',
      });
    }
  };

  //delete banner

  export const deleteBannerById = async (req, res) => {
    try {
      const { bannerId } = req.params;
  
      const banner = await Banner.findByPk(bannerId);
  
      if (banner) {
        await banner.destroy();
        res.status(200).json({
          success: true,
          message: 'Banner deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Banner not found',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error deleting the banner',
      });
    }
  };

//update banner

export const updateBannerById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const {bannerId} = req.params; 
    const banner = req.file; 
    if (banner) {
      const imageContent = fs.readFileSync(banner.path); 
      
      const existingBanner = await Banner.findByPk(bannerId);

      if (existingBanner) {
        existingBanner.name = name;
        existingBanner.banner = imageContent; 
        existingBanner.description = description;

        await existingBanner.save();

        res.status(200).json({
          success: true,
          message: 'Banner updated successfully',
          updatedBanner: existingBanner,
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Banner not found',
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'No banner file found', 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error updating the banner',  
    });
  }
};
