
import React, { useState } from 'react';
import { VehicleInfo, CustomerInfo } from '../types';
import { lookupVehicleByVin } from '../services/geminiService';
import VinScanner from './VinScanner';

interface VehicleFormProps {
  vehicleData: VehicleInfo;
  customerData: CustomerInfo;
  onVehicleChange: (data: VehicleInfo) => void;
  onCustomerChange: (data: CustomerInfo) => void;
  onNext: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  vehicleData, 
  customerData, 
  onVehicleChange, 
  onCustomerChange, 
  onNext 
}) => {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onVehicleChange({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomerChange({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleVinLookup = async (vinOverride?: string) => {
    const vinToUse = vinOverride || vehicleData.vin;
    const cleanVin = vinToUse.trim();
    if (cleanVin.length < 11) return;
    
    setIsLookingUp(true);
    try {
      const info = await lookupVehicleByVin(cleanVin);
      onVehicleChange({
        ...vehicleData,
        vin: cleanVin, // Ensure VIN is updated if passed via override
        year: info.year || vehicleData.year,
        make: info.make || vehicleData.make,
        model: info.model || vehicleData.model
      });
    } catch (error) {
      console.error("VIN decoding failed:", error);
      alert("Could not automatically decode VIN. Please enter details manually.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const isFormValid = vehicleData.year && 
                      vehicleData.make && 
                      vehicleData.model && 
                      vehicleData.mileage && 
                      customerData.firstName && 
                      customerData.lastName;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">New Inquiry Intake</h2>
          <p className="text-slate-500">Please provide your contact details and vehicle information.</p>
        </div>
        
        <div className="space-y-6">
          {/* Customer Information Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={customerData.firstName}
                  onChange={handleCustomerChange}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={customerData.lastName}
                  onChange={handleCustomerChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input 
                type="text" 
                name="address"
                value={customerData.address}
                onChange={handleCustomerChange}
                placeholder="123 Street Ave, City, NC"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={customerData.email}
                onChange={handleCustomerChange}
                placeholder="john.doe@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </section>

          {/* Vehicle Information Section */}
          <section className="space-y-4 pt-4">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b pb-2">Vehicle Information</h3>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">VIN Number (Optional)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  name="vin"
                  value={vehicleData.vin}
                  onChange={handleVehicleChange}
                  placeholder="17-character VIN"
                  className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono uppercase"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="px-4 py-3 rounded-lg font-semibold bg-slate-800 text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVinLookup()}
                    disabled={isLookingUp || vehicleData.vin.length < 11}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${isLookingUp || vehicleData.vin.length < 11 ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95'}`}
                  >
                    {isLookingUp ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    Lookup
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <input 
                  type="text" 
                  name="year"
                  value={vehicleData.year}
                  onChange={handleVehicleChange}
                  placeholder="e.g. 2024"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Mileage</label>
                <input 
                  type="text" 
                  name="mileage"
                  value={vehicleData.mileage}
                  onChange={handleVehicleChange}
                  placeholder="e.g. 45,000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                <input 
                  type="text" 
                  name="make"
                  value={vehicleData.make}
                  onChange={handleVehicleChange}
                  placeholder="e.g. Toyota"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input 
                  type="text" 
                  name="model"
                  value={vehicleData.model}
                  onChange={handleVehicleChange}
                  placeholder="e.g. Camry"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <button 
            onClick={onNext}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Capture Damage Details
          </button>
        </div>
      </div>

      {showScanner && (
        <VinScanner 
          onVinFound={(vin) => {
            onVehicleChange({ ...vehicleData, vin });
            setShowScanner(false);
            // Optional: Automatically trigger lookup after scan
            handleVinLookup(vin);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};

export default VehicleForm;
