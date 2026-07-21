
import React, { useState } from 'react';
import { VehicleInfo, CustomerInfo } from '../types';
import { lookupVehicleByVin } from '../services/geminiService';
import VinScanner from './VinScanner';
import StepIndicator from './StepIndicator';

interface VehicleFormProps {
  vehicleData: VehicleInfo;
  customerData: CustomerInfo;
  onVehicleChange: (data: VehicleInfo) => void;
  onCustomerChange: (data: CustomerInfo) => void;
  onNext: () => void;
  onBack?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicleData,
  customerData,
  onVehicleChange,
  onCustomerChange,
  onNext,
  onBack
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
      <StepIndicator current={1} />
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-6">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-navy mb-3 -ml-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              All tools
            </button>
          )}
          <h2 className="text-2xl font-bold text-slate-800 font-display">Tell us about you &amp; your vehicle</h2>
          <p className="text-slate-500 mt-1">Quick details so we can tailor your estimate. Takes about a minute.</p>
        </div>

        <div className="space-y-6">
          {/* Customer Information Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-brand-navy uppercase tracking-widest border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={customerData.firstName}
                  onChange={handleCustomerChange}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
              />
            </div>
          </section>

          {/* Vehicle Information Section */}
          <section className="space-y-4 pt-4">
            <h3 className="text-xs font-black text-brand-navy uppercase tracking-widest border-b pb-2">Vehicle Information</h3>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">VIN Number (Optional)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  name="vin"
                  value={vehicleData.vin}
                  onChange={handleVehicleChange}
                  placeholder="17-character VIN"
                  className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base font-mono uppercase"
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
                    className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${isLookingUp || vehicleData.vin.length < 11 ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-brand-navy hover:bg-blue-100 active:scale-95'}`}
                  >
                    {isLookingUp ? (
                      <div className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your collision deductible <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <select
                name="deductible"
                value={vehicleData.deductible || ''}
                onChange={handleVehicleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-base bg-white"
              >
                <option value="">Not sure / skip</option>
                <option value="250">$250</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="2500">$2,500</option>
                <option value="5000">$5,000</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">So we can tell you whether it's worth filing a claim. Stays on your device &mdash; never sent to the AI.</p>
            </div>
          </section>

          <button
            onClick={onNext}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${isFormValid ? 'bg-brand-navy hover:bg-brand-navy-dk active:scale-[0.98]' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Continue to Photos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
          {!isFormValid && (
            <p className="text-center text-xs text-slate-400 mt-2">Fill in your name and the year, make, model &amp; mileage to continue.</p>
          )}
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
