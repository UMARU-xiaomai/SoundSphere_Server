/**
 * SoundSphere Markdown Parser
 * 简单的Markdown解析器，用于博客系统
 */

class MarkdownParser {
    constructor() {
        this.rules = [
            // 标题
            { pattern: /^(#{1,6})\s+(.+)$/gm, replacement: (match, hashes, content) => {
                const level = hashes.length;
                return `<h${level}>${content.trim()}</h${level}>`;
            }},
            
            // 粗体
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /__(.*?)__/g, replacement: '<strong>$1</strong>' },
            
            // 斜体
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            { pattern: /_(.*?)_/g, replacement: '<em>$1</em>' },
            
            // 链接
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
            
            // 图片
            { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" class="md-img">' },
            
            // 引用
            { pattern: /^>\s+(.+)$/gm, replacement: '<blockquote>$1</blockquote>' },
            
            // 代码块
            { pattern: /```([a-z]*)\n([\s\S]*?)\n```/g, replacement: (match, lang, code) => {
                return `<pre><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>`;
            }},
            
            // 行内代码
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
            
            // 水平线
            { pattern: /^---$/gm, replacement: '<hr>' },
            
            // 无序列表
            { pattern: /^[*+-]\s+(.+)$/gm, replacement: '<li>$1</li>' },
            
            // 有序列表
            { pattern: /^\d+\.\s+(.+)$/gm, replacement: '<li>$1</li>' },
            
            // 表格 (简化版)
            { pattern: /\|(.+)\|/g, replacement: (match, content) => {
                const cells = content.split('|').map(cell => cell.trim());
                return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
            }}
        ];
    }
    
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    processLists(html) {
        // 处理无序列表
        html = html.replace(/<li>(.+?)<\/li>\n<li>/g, '<li>$1</li>\n<li>');
        html = html.replace(/(<li>(.+?)<\/li>\n)+/g, match => {
            return `<ul>${match}</ul>`;
        });
        
        // 处理有序列表
        html = html.replace(/(<li>(.+?)<\/li>\n)+/g, match => {
            if (match.includes('1. ') || match.includes('2. ')) {
                return `<ol>${match}</ol>`;
            }
            return match;
        });
        
        return html;
    }
    
    processTables(html) {
        // 处理表格
        html = html.replace(/(<tr>(.+?)<\/tr>\n)+/g, match => {
            return `<table>${match}</table>`;
        });
        
        return html;
    }
    
    parse(markdown) {
        if (!markdown) return '';
        
        let html = markdown + '\n';
        
        // 应用规则
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // 处理列表和表格
        html = this.processLists(html);
        html = this.processTables(html);
        
        // 处理段落 (非标题、列表、引用等的文本行)
        html = html.replace(/^(?!<[a-z])(.+)$/gm, '<p>$1</p>');
        
        // 处理换行
        html = html.replace(/\n/g, '');
        
        return html;
    }
}

// 实例化解析器
const markdownParser = new MarkdownParser();

// 导出解析方法
function parseMarkdown(markdown) {
    return markdownParser.parse(markdown);
}

// 为编辑器工具栏提供支持的函数
function applyMarkdownFormat(element, format) {
    const textarea = element;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';
    
    switch(format) {
        case 'bold':
            replacement = `**${selectedText}**`;
            break;
        case 'italic':
            replacement = `*${selectedText}*`;
            break;
        case 'heading':
            replacement = `## ${selectedText}`;
            break;
        case 'link':
            if (selectedText) {
                replacement = `[${selectedText}](url)`;
            } else {
                replacement = `[链接文本](url)`;
            }
            break;
        case 'image':
            replacement = `![图片描述](图片URL)`;
            break;
        case 'list':
            // 如果选中了多行文本，为每行添加列表标记
            if (selectedText.includes('\n')) {
                replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
            } else {
                replacement = `- ${selectedText}`;
            }
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                replacement = `\`\`\`\n${selectedText}\n\`\`\``;
            } else {
                replacement = `\`${selectedText}\``;
            }
            break;
        case 'quote':
            // 如果选中了多行文本，为每行添加引用标记
            if (selectedText.includes('\n')) {
                replacement = selectedText.split('\n').map(line => `> ${line}`).join('\n');
            } else {
                replacement = `> ${selectedText}`;
            }
            break;
        case 'table':
            replacement = `| 标题1 | 标题2 | 标题3 |\n|--------|--------|--------|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |`;
            break;
    }
    
    // 替换文本
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    // 设置光标位置
    const newCursorPos = start + replacement.length;
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;
    
    // 聚焦文本区域
    textarea.focus();
}

// 导出工具栏功能
window.SoundSphere = window.SoundSphere || {};
window.SoundSphere.markdown = {
    parse: parseMarkdown,
    applyFormat: applyMarkdownFormat
}; 