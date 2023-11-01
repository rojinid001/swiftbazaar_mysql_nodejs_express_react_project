import Review from '../models/reviewModel.js';

export const getAllReviews = async (req, res) => {
    try {
    
      const reviews = await Review.findAll();
  
      if (reviews) {
        return res.status(200).json({
          success: true,
          message: 'Reviews retrieved successfully',
          data: reviews,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No reviews found',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };




export const searchReview = async (req, res) => {
    const { searchProductId } = req.params;
  
    try {
     
      const reviews = await Review.findAll({
        where: { productId: searchProductId },
      });
  
      if (reviews && reviews.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Reviews retrieved successfully',  
          data: reviews,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'No products available for the provided product ID', 
          data: [],
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    };
  };
  
  

// delete product review

export const deleteReview = async (req, res) => {
    const { reviewId } = req.params; 
  
    try {
  
      const deletedReview = await Review.destroy({
        where: { id: reviewId },
      });
  
      if (deletedReview) {
        return res.status(200).json({
          success: true,
          message: 'Review deleted successfully',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Review not found or could not be deleted',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };