import React, { useEffect, useRef, createRef, useState } from 'react';

function AutoResizeTextArea({content, saveContent}) {
    const ref = createRef();

    useEffect(() => {
        ref.current.focus();
        resize();
        saveContent(content);
        console.log("reset");
    }, [])

    const resize = () => {
        ref.current.style.height = ref.current.scrollHeight + 'px';
      };

    const onContentChanged = event => {
        resize();
        saveContent(event.target.value);
    }

    return (
        <div className='edit-text-container'>
            <textarea ref={ref} className='edit-text-area' onChange={onContentChanged} rows={1} defaultValue={content}></textarea>
        </div>
    );
}

export default AutoResizeTextArea;
