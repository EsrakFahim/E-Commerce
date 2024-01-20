import React from 'react';
import { Range } from 'react-range';

const RangeBar = () => {
      const [values, setValues] = React.useState([0, 100]);

      const handleRangeChange = (newValues) => {
            setValues(newValues);
      };

      return (
            <div style={{ margin: '20px' }}>
                  <label>
                        Price Range: ${values[0]} - ${values[1]}
                  </label>
                  <Range
                        step={1}
                        min={0}
                        max={1000} // Set your desired maximum value
                        values={values}
                        onChange={handleRangeChange}
                        renderTrack={({ props, children }) => (
                              <div
                                    {...props}
                                    style={{
                                          ...props.style,
                                          height: '6px',
                                          width: '100%',
                                          backgroundColor: '#ccc',
                                    }}
                              >
                                    {children}
                              </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                              <div
                                    {...props}
                                    style={{
                                          ...props.style,
                                          height: '20px',
                                          width: '20px',
                                          borderRadius: '50%',
                                          backgroundColor: '#fff',
                                          boxShadow: '0px 2px 6px #AAA',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          border: '2px solid #999',
                                    }}
                              >
                                    <div
                                          style={{
                                                height: '6px',
                                                width: '6px',
                                                backgroundColor: isDragged ? '#548BF4' : '#CCC',
                                                borderRadius: '50%',
                                          }}
                                    />
                              </div>
                        )}
                  />
            </div>
      );
};

export default RangeBar;
