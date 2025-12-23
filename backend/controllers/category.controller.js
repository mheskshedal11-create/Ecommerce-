import Category from "../models/category.model.js";

// add category 
export const addCategoryControllr = async (req, res) => {
    try {
        const { name, image } = req.body
        if (!name || !image) {
            return res.status(400).json({
                success: false,
                message: 'Enter Required Field'
            })
        }

        const newcategory = new Category({
            name,
            image
        })

        const saveCategory = await newcategory.save()
        if (!saveCategory) {
            return res.status(201).json({
                success: false,
                message: 'Category Create Successfully'
            })
        }
        return res.status(201).json({
            success: true,
            message: 'Category Create Successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || error
        })
    }
}

//get category 

export const getCategoryController = async (req, res) => {
    try {
        let data = await Category.find().sort({ createdAt: -1 })
        if (data.length <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            })
        }
        return res.status(201).json({
            success: true,
            message: 'category fetch successfully',
            data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || error
        })

    }
}

//update category
export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body;

        // Update the category only if the fields are provided
        const update = await Category.findByIdAndUpdate(
            { _id: _id },
            {
                ...(name && { name }),  // Correct spread syntax
                ...(image && { image }) // Correct spread syntax
            },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: update
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};

