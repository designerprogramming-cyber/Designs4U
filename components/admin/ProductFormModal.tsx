
import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import type { Product, Category, ProductVariant } from '../../types';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
  onClose: () => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, categories, onSave, onClose }) => {
  const { t } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [variants, setVariants] = useState<Omit<ProductVariant, 'id'>[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategoryId(product.categoryId);
      setImageUrl(product.imageUrl);
      setVariants(product.variants.map(({id, ...rest}) => rest));
    } else {
        setVariants([{ name: 'Standard File', price: 0, downloadUrl: '', fileName: '' }]);
        if (categories.length > 0) {
            setCategoryId(categories[0].id);
        }
    }
  }, [product, categories]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
    }
  };

  const handleVariantChange = (index: number, field: keyof Omit<ProductVariant, 'id'>, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  const handleVariantFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      const newVariants = [...variants];
      newVariants[index].downloadUrl = dataUrl;
      newVariants[index].fileName = file.name;
      setVariants(newVariants);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0, downloadUrl: '', fileName: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
        setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !imageUrl || variants.some(v => !v.downloadUrl)) {
        alert("Please fill all fields, including image and variant files.");
        return;
    }
    const productData = { 
        name, 
        description, 
        categoryId, 
        imageUrl, 
        variants: variants.map(v => ({...v, id: `var_${Date.now()}_${Math.random()}`}))
    };
    if (product) {
      onSave({ ...product, ...productData });
    } else {
      onSave(productData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">{product ? t('editProduct') : t('addProduct')}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium">{t('productName')}</label>
                        <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="categoryId" className="block mb-2 text-sm font-medium">{t('category')}</label>
                        <select name="categoryId" id="categoryId" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" required>
                            <option value="" disabled>{t('selectCategory')}</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium">{t('productDescription')}</label>
                        <textarea name="description" id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">{t('uploadImage')}</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                        {imageUrl && <img src={imageUrl} alt={t('imagePreview')} className="mt-2 rounded-lg h-32 w-auto object-cover" />}
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-2">{t('productVariants')}</h3>
                        <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-gray-50 space-y-3 relative">
                                {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 end-2 text-red-500 hover:text-red-700">&times;</button>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">{t('variantName')}</label>
                                        <input type="text" value={variant.name} onChange={e => handleVariantChange(index, 'name', e.target.value)} className="w-full mt-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg block p-2" required/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">{t('priceLabel')}</label>
                                        <input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value))} className="w-full mt-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg block p-2" required/>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('uploadFile')}</label>
                                    <input type="file" onChange={e => handleVariantFileChange(index, e)} className="w-full mt-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white" />
                                    {variant.fileName && <span className="text-xs text-gray-500 mt-1 block">{variant.fileName}</span>}
                                </div>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addVariant} className="mt-4 text-sm font-medium text-primary hover:underline">{t('addVariant')}</button>
                    </div>

                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-4">
                <button type="button" onClick={onClose} className="text-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {t('cancel')}
                </button>
                <button type="submit" className="text-white bg-primary hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {t('saveChanges')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;