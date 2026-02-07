"use client";
import React, { useState } from "react";
import { IconSearch, IconFilter, IconPlus, IconTrash, IconEdit, IconPackage, IconAlertCircle, IconMedicineSyrup, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

interface InventoryItem {
    id: string;
    name: string;
    category: "Medical Device" | "Pharmaceuticals" | "Surgical" | "General";
    quantity: number;
    location: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    expiryDate?: string;
}

const initialItems: InventoryItem[] = [
    { id: "INV-001", name: "MRI Machine (Philips)", category: "Medical Device", quantity: 2, location: "Radiology", status: "In Stock" },
    { id: "INV-002", name: "Amoxicillin 500mg", category: "Pharmaceuticals", quantity: 500, location: "Pharmacy A", status: "In Stock", expiryDate: "2025-12-01" },
    { id: "INV-003", name: "Surgical Scalpel #10", category: "Surgical", quantity: 50, location: "OR Supply", status: "Low Stock" },
    { id: "INV-004", name: "Paracetamol", category: "Pharmaceuticals", quantity: 1000, location: "Pharmacy B", status: "In Stock", expiryDate: "2026-01-15" },
    { id: "INV-005", name: "Defibrillator", category: "Medical Device", quantity: 10, location: "Emergency", status: "In Stock" },
    { id: "INV-006", name: "Sterile Gloves (Box)", category: "General", quantity: 0, location: "Storage 2", status: "Out of Stock" },
];

const Inventory = () => {
    const [items, setItems] = useState<InventoryItem[]>(initialItems);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>("All");

    const filteredItems = items.filter(item =>
        (filterCategory === "All" || item.category === filterCategory) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem: InventoryItem = {
            id: `INV-${String(items.length + 1).padStart(3, '0')}`,
            name: formData.get('name') as string,
            category: formData.get('category') as InventoryItem['category'],
            quantity: Number(formData.get('quantity')),
            location: formData.get('location') as string,
            status: Number(formData.get('quantity')) === 0 ? "Out of Stock" : Number(formData.get('quantity')) < 50 ? "Low Stock" : "In Stock",
            expiryDate: formData.get('expiryDate') as string || undefined
        };
        setItems([...items, newItem]);
        setShowAddModal(false);
        alert("Item added successfully!");
    };

    const handleEditItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedItem) return;
        const formData = new FormData(e.currentTarget);
        const updatedItem: InventoryItem = {
            ...selectedItem,
            name: formData.get('name') as string,
            category: formData.get('category') as InventoryItem['category'],
            quantity: Number(formData.get('quantity')),
            location: formData.get('location') as string,
            status: Number(formData.get('quantity')) === 0 ? "Out of Stock" : Number(formData.get('quantity')) < 50 ? "Low Stock" : "In Stock",
            expiryDate: formData.get('expiryDate') as string || undefined
        };
        setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
        setShowEditModal(false);
        setSelectedItem(null);
        alert("Item updated successfully!");
    };

    const handleDeleteItem = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setItems(items.filter(item => item.id !== id));
            alert("Item deleted successfully!");
        }
    };

    const openEditModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
            case "Low Stock": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "Out of Stock": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="h-full w-full p-6 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hospital Inventory</h1>
                    <p className="text-gray-500 mt-1">Track medical supplies, pharmaceuticals, and equipment.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
                >
                    <IconPlus size={20} className="mr-2" /> Add supply
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-between">
                <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-500 transition-colors">
                    <IconSearch size={20} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search supplies..."
                        className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 w-full placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        <option value="All">All Categories</option>
                        <option value="Medical Device">Medical Device</option>
                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                        <option value="Surgical">Surgical</option>
                        <option value="General">General</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                <AnimatePresence>
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                                        {item.category === "Pharmaceuticals" ? <IconMedicineSyrup size={24} /> : <IconPackage size={24} />}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.category}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span>Quantity:</span>
                                        <span className="font-semibold">{item.quantity} units</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span>Location:</span>
                                        <span className="font-semibold">{item.location}</span>
                                    </div>
                                    {item.expiryDate && (
                                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                                            <span>Expiry:</span>
                                            <span className="font-semibold text-red-500">{item.expiryDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700 justify-end">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <IconEdit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {filteredItems.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    No items found.
                </div>
            )}

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Supply</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Enter item name"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select 
                                        name="category"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Medical Device">Medical Device</option>
                                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                                        <option value="Surgical">Surgical</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        required
                                        min="0"
                                        placeholder="Enter quantity"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        placeholder="Enter storage location"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expiry Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add Item
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Item Modal */}
            <AnimatePresence>
                {showEditModal && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Supply</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleEditItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={selectedItem.name}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select 
                                        name="category"
                                        required
                                        defaultValue={selectedItem.category}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Medical Device">Medical Device</option>
                                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                                        <option value="Surgical">Surgical</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        required
                                        min="0"
                                        defaultValue={selectedItem.quantity}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        defaultValue={selectedItem.location}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expiry Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        defaultValue={selectedItem.expiryDate}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
