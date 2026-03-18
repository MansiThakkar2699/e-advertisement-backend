const categorySchema = require("../models/CategoryModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")

const createCategory = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.path) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.secure_url;
        }

        const category = await categorySchema.create({ ...req.body, ...(imageUrl && { image: imageUrl }) });
        res.status(201).json({
            message: "Category Created",
            data: category
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "error while creating category",
            error: error
        })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const allCategories = await categorySchema.find()
        res.json({
            message: "Categories fetch successfully",
            data: allCategories
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "error while fetching categories",
            error: error
        })
    }
}

const getCategoryById = async (req, res) => {
    try {
        const foundCategory = await categorySchema.findById(req.params.id)
        if (foundCategory) {
            res.json({
                message: "Category found",
                data: foundCategory
            })
        } else {
            res.status(404).json({
                message: "Category not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while fetching category",
            error: error
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.path) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.secure_url;
        }
        const updatedCategory = await categorySchema.findByIdAndUpdate(req.params.id, { ...req.body, ...(imageUrl && { image: imageUrl }) }, { new: true })
        if (updatedCategory) {
            res.json({
                message: "Category Updated Successfully",
                data: updatedCategory
            })
        } else {
            res.status(404).json({
                message: "Category not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while updating category",
            error: error
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await categorySchema.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
        if (deletedCategory) {
            res.json({
                message: "Category deleted successfully",
                data: deletedCategory
            })
        } else {
            res.status(404).json({
                message: "Category not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while deleting category",
            error: error
        })
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}