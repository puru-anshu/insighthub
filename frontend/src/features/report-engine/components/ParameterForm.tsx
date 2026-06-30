import { useCallback, useEffect, useMemo, useState } from 'react';

import { LovDropdown } from './LovDropdown';
import type { Parameter } from '../types';

export type ParameterValues = Record<string, string | string[]>;

interface ParameterFormProps {
  /** List of parameter definitions for the report */
  parameters: Parameter[];
  /** Current parameter values */
  values: ParameterValues;
  /** Callback when parameter values change */
  onChange: (values: ParameterValues) => void;
  /** Whether the form is disabled (e.g., during execution) */
  disabled?: boolean;
}

/**
 * Runtime parameter input form for report execution.
 * Renders appropriate controls per parameter type and supports
 * cascading LOV dropdowns, multi-value selects, and expression defaults.
 */
export function ParameterForm({
  parameters,
  values,
  onChange,
  disabled = false,
}: ParameterFormProps) {
  // Initialize defaults on mount
  const [initialized, setInitialized] = useState(false);

  const sortedParams = useMemo(
    () => [...parameters].sort((a, b) => a.position - b.position),
    [parameters],
  );

  // Build a map of param ID → param for parent lookups
  const paramById = useMemo(() => {
    const map = new Map<number, Parameter>();
    parameters.forEach((p) => map.set(p.id, p));
    return map;
  }, [parameters]);

  // Pre-populate defaults on first render
  useEffect(() => {
    if (initialized || parameters.length === 0) return;

    const defaults: ParameterValues = {};
    parameters.forEach((param) => {
      if (param.defaultValue && !values[param.name]) {
        if (param.multiValue) {
          defaults[param.name] = [param.defaultValue];
        } else {
          defaults[param.name] = param.defaultValue;
        }
      }
    });

    if (Object.keys(defaults).length > 0) {
      onChange({ ...values, ...defaults });
    }
    setInitialized(true);
  }, [parameters, values, onChange, initialized]);

  const handleChange = useCallback(
    (paramName: string, value: string | string[]) => {
      onChange({ ...values, [paramName]: value });
    },
    [values, onChange],
  );

  // Get the current value for a parameter's parent (for cascading)
  const getParentValue = useCallback(
    (param: Parameter): string | undefined => {
      if (!param.parentParamId) return undefined;
      const parentParam = paramById.get(param.parentParamId);
      if (!parentParam) return undefined;
      const parentVal = values[parentParam.name];
      if (Array.isArray(parentVal)) return parentVal[0];
      return parentVal || undefined;
    },
    [paramById, values],
  );

  if (parameters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
        This report has no parameters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedParams.map((param) => (
        <ParameterField
          key={param.id}
          param={param}
          value={values[param.name] ?? (param.multiValue ? [] : '')}
          onChange={(val) => handleChange(param.name, val)}
          parentValue={getParentValue(param)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// === Individual Parameter Field ===

interface ParameterFieldProps {
  param: Parameter;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  parentValue?: string;
  disabled: boolean;
}

function ParameterField({
  param,
  value,
  onChange,
  parentValue,
  disabled,
}: ParameterFieldProps) {
  const label = (
    <label className="label mb-1 block">
      {param.label}
      {param.required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );

  switch (param.type) {
    case 'TEXT':
      return (
        <div>
          {label}
          <input
            type="text"
            className="input-field"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.placeholder || param.label}
            required={param.required}
            disabled={disabled}
          />
        </div>
      );

    case 'NUMBER':
      return (
        <div>
          {label}
          <input
            type="number"
            className="input-field"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.placeholder || param.label}
            required={param.required}
            disabled={disabled}
          />
        </div>
      );

    case 'DATE':
      return (
        <div>
          {label}
          <input
            type="date"
            className="input-field"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            required={param.required}
            disabled={disabled}
          />
        </div>
      );

    case 'DATETIME':
      return (
        <div>
          {label}
          <input
            type="datetime-local"
            className="input-field"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            required={param.required}
            disabled={disabled}
          />
        </div>
      );

    case 'BOOLEAN':
      return (
        <div>
          {label}
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={value === 'true'}
              onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
              disabled={disabled}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
            <span className="ml-2 text-sm text-gray-600">
              {value === 'true' ? 'Yes' : 'No'}
            </span>
          </label>
        </div>
      );

    case 'DROPDOWN':
      return (
        <div>
          {label}
          <LovDropdown
            parameterId={param.id}
            value={value}
            onChange={onChange}
            multiValue={param.multiValue}
            parentValue={parentValue}
            hasParent={!!param.parentParamId}
            disabled={disabled}
            required={param.required}
            staticOptions={
              param.lovType === 'STATIC' ? param.lovStaticValues : undefined
            }
          />
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            type="text"
            className="input-field"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.label}
            disabled={disabled}
          />
        </div>
      );
  }
}
