import React from 'react'

const phone-countries = () => {
  return (
    <PhoneInput
    {...field}
    value={field.value || ''}
    onChange={(value) => {
      form.setValue('telefono', value || '');
  }}  
    placeholder="Teléfono"
    defaultCountry="MX"
    international={false}
    withCountryCallingCode={false}
    containerComponentProps={{
      className:
        "flex h-10 w-full rounded-md border border-input bg-background pl-3 py-0 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    }}

numberInputProps={{
      className:
        "pl-3",
    }}     
    />
  )
}

export default phone-countries
