
import React, { useState } from 'react';
import { useApp } from '../../App';
import type { Category } from '../../types';

interface ManageCategoriesProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const { t } = useApp();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
        onDeleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex items-center gap-4">
        <div className="flex-grow">
          <label htmlFor="categoryName" className="sr-only">{t('categoryName')}</label>
          <input
            type="text"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={t('categoryName')}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-primary hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {t('addCategory')}
        </button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {categories.map(category => (
            <li key={category.id} className="p-4 flex justify-between items-center">
              <span className="text-gray-800 dark:text-white">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                {t('delete')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageCategories;
