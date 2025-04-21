import React, { useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import {addtimeTable} from "@/pages/Page1/Service";
const Page1: React.FC = () => {
  const [text, setText] = useState('');

  const sendToBackend = async (content: string) => {
      addtimeTable(content);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    console.log('User input:', newText);
    sendToBackend(newText);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div
          style={{
            backgroundColor: '#FACC15', // Yellow-400
            color: '#000',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginRight: '12px',
          }}
        >

        </div>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Paste into the box below</h2>
      </div>

      {/* Paste Box */}
      <div
        style={{
          border: '2px solid #FACC15',
          borderRadius: '8px',
          backgroundColor: '#F3F4F6', // Tailwind gray-100
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <CopyOutlined style={{ fontSize: '32px', color: '#9CA3AF', marginBottom: '12px' }} />
        <textarea
          placeholder="Paste here! (Ctrl+V)"
          value={text}
          onChange={handleChange}
          style={{
            width: '100%',
            height: '120px',
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            color: '#374151',
            textAlign: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default Page1;
