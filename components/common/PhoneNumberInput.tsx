
import React, { useState, useEffect, useRef } from 'react';
import { COUNTRIES } from '../../constants/countries';
import type { Country } from '../../types';
import { useApp } from '../../App';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ value, onChange }) => {
  const { t } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onChange(`${country.dial_code}${phoneNumber}`);
    setIsOpen(false);
    setSearch('');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, '');
    setPhoneNumber(number);
    onChange(`${selectedCountry.dial_code}${number}`);
  };

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dial_code.includes(search)
  );
  
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return (
    <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-gray-50">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center px-4 py-2.5 h-full text-sm font-medium text-gray-700 bg-gray-100 rounded-s-lg hover:bg-gray-200"
        >
          <span>{getFlagEmoji(selectedCountry.code)}</span>
          <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto start-0">
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchCountry')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <ul>
              {filteredCountries.map((country) => (
                <li
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <span className="me-3">{getFlagEmoji(country.code)}</span>
                    <span className="text-gray-800">{country.name}</span>
                  </div>
                  <span className="text-gray-500">{country.dial_code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <span className="px-3 text-gray-500">{selectedCountry.dial_code}</span>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        className="block w-full p-2.5 text-sm text-gray-900 bg-transparent border-0 focus:ring-0"
        placeholder="123-456-7890"
        required
      />
    </div>
  );
};

export default PhoneNumberInput;

