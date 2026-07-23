"use client";

import { useEffect, useRef } from "react";

export default function CKEditor4({ value, onChange, id = "editor" }) {
  const isLoadedRef = useRef(false);
  const currentValueRef = useRef(value);

  // Keep track of the current value to avoid calling setData repeatedly while typing
  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const loadScript = () => {
      if (typeof window !== "undefined") {
        if (!document.getElementById("ckeditor-cdn-script")) {
          const script = document.createElement("script");
          script.id = "ckeditor-cdn-script";
          script.src = "https://cdn.ckeditor.com/4.22.1/full/ckeditor.js";
          script.onload = () => initEditor();
          document.body.appendChild(script);
        } else if (window.CKEDITOR) {
          initEditor();
        }
      }
    };

    const initEditor = () => {
      if (window.CKEDITOR) {
        // Destroy existing instance if any
        if (window.CKEDITOR.instances[id]) {
          window.CKEDITOR.instances[id].destroy(true);
        }

        const editor = window.CKEDITOR.replace(id, {
          versionCheck: false,
          allowedContent: true, // Allow all HTML tags, styles, and classes
          height: 250,
          toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
            { name: 'forms', groups: [ 'forms' ] },
            '/',
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
          ]
        });

        editor.on("instanceReady", () => {
          editor.setData(currentValueRef.current || "");
          isLoadedRef.current = true;
        });

        editor.on("change", () => {
          const data = editor.getData();
          currentValueRef.current = data;
          onChange(data);
        });
      }
    };

    loadScript();

    return () => {
      if (window.CKEDITOR && window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true);
      }
    };
  }, [id]);

  // Update value only if it changes from outside (e.g. data fetched from API), not when user types
  useEffect(() => {
    if (window.CKEDITOR && window.CKEDITOR.instances[id] && isLoadedRef.current) {
      const editor = window.CKEDITOR.instances[id];
      if (editor.getData() !== value) {
        editor.setData(value || "");
      }
    }
  }, [value, id]);

  return (
    <div className="border border-[#eaddc7] rounded-xl overflow-hidden bg-white">
      <textarea id={id} defaultValue={value} className="invisible h-0 w-0" />
    </div>
  );
}
