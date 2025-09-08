<template>
  <div class="collateral-form">
    <!-- Collateral Type Selection -->
    <div class="field">
      <label class="label">
        Collateral Type *
        <HelpTooltip :message="getCollateralTypeHelp()" />
      </label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="localCollateral.collateral_type" @change="onTypeChange" required>
            <option value="">Select collateral type...</option>
            <option v-for="option in collateralOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Physical Item Fields -->
    <template v-if="localCollateral.collateral_type === 'PHYSICAL_ITEM'">
      <div class="field">
        <label class="label">
          Item Name *
          <HelpTooltip message="Name or type of the item being pawned (e.g., 'Gold Ring', 'iPhone 12', 'Samsung TV')" />
        </label>
        <div class="control">
          <input class="input" type="text" v-model="localCollateral.item_name" 
                 placeholder="e.g., Gold Ring, iPhone 12, Samsung TV" required>
        </div>
      </div>

      <div class="field">
        <label class="label">
          Description
          <HelpTooltip message="Detailed description of the item including brand, model, condition, serial numbers, etc." />
        </label>
        <div class="control">
          <textarea class="textarea" v-model="localCollateral.description" 
                    placeholder="Detailed description: brand, model, condition, serial number, etc."
                    rows="3"></textarea>
        </div>
      </div>
    </template>

    <!-- Vehicle Title Fields -->
    <template v-if="localCollateral.collateral_type === 'VEHICLE_TITLE'">
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Vehicle Make *</label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.vehicle_make" 
                     placeholder="e.g., Toyota, Honda, Mitsubishi" required>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Vehicle Model *</label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.vehicle_model" 
                     placeholder="e.g., Vios, Civic, Montero" required>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Year *</label>
            <div class="control">
              <input class="input" type="number" v-model="localCollateral.vehicle_year" 
                     :min="1900" :max="new Date().getFullYear() + 1" required>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">
              VIN/Chassis Number
              <HelpTooltip message="Vehicle Identification Number or Chassis Number (optional but recommended)" />
            </label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.vehicle_vin" 
                     placeholder="17-character VIN or chassis number">
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Vehicle Description</label>
        <div class="control">
          <textarea class="textarea" v-model="localCollateral.description" 
                    placeholder="Additional details: color, condition, mileage, modifications, etc."
                    rows="3"></textarea>
        </div>
      </div>
    </template>

    <!-- Property Title Fields -->
    <template v-if="localCollateral.collateral_type === 'PROPERTY_TITLE'">
      <div class="field">
        <label class="label">
          Property Address *
          <HelpTooltip message="Complete address of the property including barangay, city, and province" />
        </label>
        <div class="control">
          <textarea class="textarea" v-model="localCollateral.property_address" 
                    placeholder="Complete address: street, barangay, city, province"
                    rows="2" required></textarea>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Property Type *</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="localCollateral.property_type" required>
                  <option value="">Select property type...</option>
                  <option value="Residential Lot">Residential Lot</option>
                  <option value="Commercial Lot">Commercial Lot</option>
                  <option value="House and Lot">House and Lot</option>
                  <option value="Condominium Unit">Condominium Unit</option>
                  <option value="Agricultural Land">Agricultural Land</option>
                  <option value="Industrial Property">Industrial Property</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">
              Title Number
              <HelpTooltip message="Official title number from the Registry of Deeds" />
            </label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.title_number" 
                     placeholder="Title or TCT number">
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Property Description</label>
        <div class="control">
          <textarea class="textarea" v-model="localCollateral.description" 
                    placeholder="Additional details: lot area, building details, landmarks, etc."
                    rows="3"></textarea>
        </div>
      </div>
    </template>

    <!-- Check Fields -->
    <template v-if="localCollateral.collateral_type === 'CHECK'">
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Check Number *</label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.check_number" 
                     placeholder="Check serial number" required>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Check Date *</label>
            <div class="control">
              <input class="input" type="date" v-model="localCollateral.check_date" required>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Check Amount (₱) *</label>
            <div class="control has-icons-left">
              <input class="input" type="number" step="0.01" v-model="localCollateral.check_amount" 
                     placeholder="0.00" required>
              <span class="icon is-small is-left">
                <i class="fas fa-peso-sign"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Bank Name *</label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.bank_name" 
                     placeholder="e.g., BDO, BPI, Metrobank" required>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">
              Drawer/Account Holder *
              <HelpTooltip message="Name of the person or company who issued the check" />
            </label>
            <div class="control">
              <input class="input" type="text" v-model="localCollateral.drawer_name" 
                     placeholder="Account holder name" required>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Additional Notes</label>
        <div class="control">
          <textarea class="textarea" v-model="localCollateral.description" 
                    placeholder="Any additional information about the check"
                    rows="2"></textarea>
        </div>
      </div>
    </template>

    <!-- Estimated Value (Common to all types) -->
    <div class="field" v-if="localCollateral.collateral_type">
      <label class="label">
        Estimated Value (₱)
        <HelpTooltip message="Appraised or estimated market value of the collateral. This helps determine loan amount." />
      </label>
      <div class="control has-icons-left">
        <input class="input" type="number" step="0.01" v-model="localCollateral.estimated_value" 
               placeholder="0.00">
        <span class="icon is-small is-left">
          <i class="fas fa-peso-sign"></i>
        </span>
      </div>
      <p class="help">Enter the current market value or appraised value of the collateral.</p>
    </div>

    <!-- Collateral Status Indicator -->
    <div class="notification is-light" v-if="isCollateralComplete">
      <span class="icon has-text-success">
        <i class="fas fa-check-circle"></i>
      </span>
      <strong>Collateral information complete!</strong>
      This collateral is ready to be saved with the loan.
    </div>
  </div>
</template>

<script>
import HelpTooltip from '../common/HelpTooltip.vue';

export default {
  name: 'CollateralForm',
  components: {
    HelpTooltip
  },
  props: {
    collateral: {
      type: Object,
      default: () => ({})
    },
    collateralType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localCollateral: { ...this.collateral }
    };
  },
  computed: {
    collateralOptions() {
      // Filter options based on loan type
      const allOptions = [
        { value: 'PHYSICAL_ITEM', label: 'Physical Item (Jewelry, Electronics, etc.)' },
        { value: 'VEHICLE_TITLE', label: 'Vehicle Title' },
        { value: 'PROPERTY_TITLE', label: 'Property Title' },
        { value: 'CHECK', label: 'Post-dated Check' },
        { value: 'NONE', label: 'No Collateral' }
      ];

      // Filter based on loan type
      switch (this.collateralType) {
        case 'PAWN':
          return allOptions.filter(opt => opt.value === 'PHYSICAL_ITEM');
        case 'TITLE':
          return allOptions.filter(opt => ['VEHICLE_TITLE', 'PROPERTY_TITLE'].includes(opt.value));
        case 'CHECK_REDISCOUNT':
          return allOptions.filter(opt => opt.value === 'CHECK');
        case 'SECURED':
          return allOptions.filter(opt => opt.value !== 'NONE');
        case 'UNSECURED':
          return allOptions.filter(opt => opt.value === 'NONE');
        default:
          return allOptions;
      }
    },

    isCollateralComplete() {
      if (!this.localCollateral.collateral_type) return false;

      const requiredFields = this.getRequiredFields();
      return requiredFields.every(field => this.localCollateral[field]);
    }
  },
  watch: {
    localCollateral: {
      handler(newVal) {
        this.$emit('update', newVal);
      },
      deep: true
    },
    collateral: {
      handler(newVal) {
        this.localCollateral = { ...newVal };
      },
      deep: true
    }
  },
  methods: {
    onTypeChange() {
      // Clear type-specific fields when type changes
      const fieldsToKeep = ['collateral_type', 'description', 'estimated_value'];
      const newCollateral = {};
      
      fieldsToKeep.forEach(field => {
        if (this.localCollateral[field]) {
          newCollateral[field] = this.localCollateral[field];
        }
      });
      
      this.localCollateral = newCollateral;
    },

    getCollateralTypeHelp() {
      const helpTexts = {
        'PHYSICAL_ITEM': 'Physical items like jewelry, electronics, appliances that can be held as collateral',
        'VEHICLE_TITLE': 'Vehicle registration or title documents for cars, motorcycles, trucks',
        'PROPERTY_TITLE': 'Land titles, house titles, or property ownership documents',
        'CHECK': 'Post-dated checks that serve as payment guarantee',
        'NONE': 'No collateral required - unsecured loan'
      };
      
      return 'Select the type of collateral for this loan. ' + 
             Object.values(helpTexts).join('. ');
    },

    getRequiredFields() {
      const type = this.localCollateral.collateral_type;
      const commonRequired = ['collateral_type'];

      switch (type) {
        case 'PHYSICAL_ITEM':
          return [...commonRequired, 'item_name'];
        case 'VEHICLE_TITLE':
          return [...commonRequired, 'vehicle_make', 'vehicle_model', 'vehicle_year'];
        case 'PROPERTY_TITLE':
          return [...commonRequired, 'property_address', 'property_type'];
        case 'CHECK':
          return [...commonRequired, 'check_number', 'check_date', 'check_amount', 'bank_name', 'drawer_name'];
        case 'NONE':
          return commonRequired;
        default:
          return commonRequired;
      }
    }
  }
};
</script>

