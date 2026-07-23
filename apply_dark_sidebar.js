const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('page.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(adminDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Make main background white instead of off-white (#faf8f5)
    content = content.replace(/<div className="min-h-screen bg-\[#faf8f5\]/g, '<div className="min-h-screen bg-white');
    content = content.replace(/<main className="flex-1 flex flex-col bg-\[#faf8f5\]/g, '<main className="flex-1 flex flex-col bg-white');
    content = content.replace(/<main className="flex-1 flex flex-col min-w-0 overflow-y-auto">/g, '<main className="flex-1 flex flex-col bg-white min-w-0 overflow-y-auto">');

    // Sidebar: Dark Mode Changes
    // 1. Aside background and border
    content = content.replace(/<aside className="w-64 border-r border-\[#eaddc7\]\/50 bg-white/g, '<aside className="w-64 border-r border-white/10 bg-[#1c1917]');
    
    // 2. Brand section border and text
    content = content.replace(/<div className="p-6 border-b border-\[#eaddc7\]\/40 flex items-center gap-3">/g, '<div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">');
    
    // 3. Links default state (unactive)
    // hover:bg-[#faf8f5] -> hover:bg-[#292524]
    // text-[#57534e] -> text-zinc-400
    // hover:text-[#b8965a] -> hover:text-white
    content = content.replace(/hover:bg-\[#faf8f5\] text-\[#57534e\] hover:text-\[#b8965a\]/g, 'hover:bg-[#292524] text-zinc-400 hover:text-white');
    
    // 4. User info bottom section
    content = content.replace(/<div className="p-4 border-t border-\[#eaddc7\]\/40 bg-\[#faf8f5\]\/50">/g, '<div className="p-4 border-t border-white/10 bg-[#1c1917]">');
    
    // 5. User text colors
    content = content.replace(/<div className="text-xs font-semibold text-\[#1c1917\]/g, '<div className="text-xs font-semibold text-white');
    content = content.replace(/<div className="text-\[10px\] text-zinc-400/g, '<div className="text-[10px] text-zinc-500');

    // 6. Logout button
    content = content.replace(/gap-2 bg-white hover:bg-rose-50 border border-\[#eaddc7\] hover:border-rose-200 text-\[#57534e\]/g, 'gap-2 bg-[#292524] hover:bg-rose-950/30 border border-white/5 hover:border-rose-900/50 text-zinc-300');

    // Extra check for admin layout top headers if any
    content = content.replace(/<header className="h-16 border-b border-\[#eaddc7\]\/40 px-8 flex items-center justify-between shrink-0 bg-white\/80/g, '<header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Sidebar dark mode and main white background applied successfully to all admin files.');
