document.addEventListener('DOMContentLoaded', function() {
	// 添加全局变量存储生成的词语数组
	let generatedWords = [];

	// 获取DOM元素
	const syllablePattern = document.getElementById('syllablePattern');
	const addSyllableBtn = document.getElementById('addSyllable');
	const removeSyllableBtn = document.getElementById('removeSyllable');
	const generateBtn = document.getElementById('generateBtn');
	const exportBtn = document.getElementById('exportBtn');
	const clearBtn = document.getElementById('clearBtn');
	const wordOutput = document.getElementById('wordOutput');
	const wordCount = document.getElementById('wordCount');
	const generationMethod = document.getElementById('generationMethod');

	// 添加音节
	addSyllableBtn.addEventListener('click', function() {
		const currentPattern = syllablePattern.value.trim();
		if (currentPattern === '') {
			syllablePattern.value = 'CV';
		} else {
			syllablePattern.value = currentPattern + ' CV';
		}
	});

	// 移除音节
	removeSyllableBtn.addEventListener('click', function() {
		const syllables = syllablePattern.value.trim().split(' ');
		if (syllables.length > 1) {
			syllables.pop();
			syllablePattern.value = syllables.join(' ');
		}
	});

	// 生成词语
	generateBtn.addEventListener('click', generateWords);

	// 清除结果
	clearBtn.addEventListener('click', function() {
		wordOutput.innerHTML = '';
		wordCount.textContent = '0';
		generatedWords = [];
	});

	// 导出为TXT
	exportBtn.addEventListener('click', function() {
		const content = generatedWords.join('\n');
		if (!content) {
			alert('请先生成一些词语！');
			return;
		}

		const blob = new Blob([content], {
			type: 'text/plain'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'generated_words.txt';
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 0);
	});

	// 生成词语函数
	function generateWords() {
		const pattern = syllablePattern.value.trim();
		if (!pattern) {
			alert('请输入音节结构');
			return;
		}

		// 获取音位配置
		const consonants = document.getElementById('consonants').value.split(',').map(s => s.trim()).filter(
			Boolean);
		const vowels = document.getElementById('vowels').value.split(',').map(s => s.trim()).filter(Boolean);
		const tones = document.getElementById('tones').value.split(',').map(s => s.trim()).filter(Boolean);
		const custom1 = document.getElementById('custom1').value.split(',').map(s => s.trim()).filter(Boolean);

		// 定义音位映射
		const phonemeMap = {
			'C': consonants,
			'V': vowels,
			'T': tones,
			'X': custom1
		};

		// 解析音节结构
		const syllables = pattern.split(' ').map(syll => syll.toUpperCase());

		// 验证结构
		for (const syll of syllables) {
			for (const char of syll) {
				if (!phonemeMap[char] || phonemeMap[char].length === 0) {
					alert(`符号 "${char}" 没有配置备选音位`);
					return;
				}
			}
		}

		// 获取高级选项
		const maxResults = parseInt(document.getElementById('maxResults').value);
		const separator = document.getElementById('wordSeparator').value || '';
		const method = generationMethod.value;

		let words = [];

		if (method === 'random') {
			// 随机生成模式
			for (let i = 0; i < maxResults; i++) {
				let wordParts = [];

				// 为每个音节生成随机组合
				for (const syll of syllables) {
					let syllableStr = '';
					for (const char of syll) {
						const phonemes = phonemeMap[char];
						const randomIndex = Math.floor(Math.random() * phonemes.length);
						syllableStr += phonemes[randomIndex];
					}
					wordParts.push(syllableStr);
				}

				// 直接使用分隔符连接音节
				words.push(wordParts.join(separator));
			}
		} else {
			// 顺序生成模式
			words = generateSequentialWords(syllables, phonemeMap, separator, maxResults);
		}

		// 显示结果
		wordOutput.innerHTML = words.join('<br>');
		wordCount.textContent = words.length;

		// 保存生成的词语数组到全局变量
		generatedWords = words;
	}

	// 顺序生成单词的函数
	function generateSequentialWords(syllables, phonemeMap, separator, maxResults) {
		let words = [''];

		for (const syll of syllables) {
			const newWords = [];

			for (const word of words) {
				const syllCombinations = generateSyllableCombinations(syll, phonemeMap);

				for (const combination of syllCombinations) {
					if (newWords.length >= maxResults) break;

					const newWord = word ? word + separator + combination : combination;
					newWords.push(newWord);
				}

				if (newWords.length >= maxResults) break;
			}

			words = newWords;
			if (words.length === 0) break;
		}

		return words;
	}

	// 生成单个音节的所有组合
	function generateSyllableCombinations(syllable, phonemeMap) {
		const positions = syllable.split('');
		let combinations = [''];

		for (const pos of positions) {
			const newCombinations = [];
			const phonemes = phonemeMap[pos] || [pos];

			for (const phoneme of phonemes) {
				for (const combo of combinations) {
					newCombinations.push(combo + phoneme);
				}
			}

			combinations = newCombinations;
		}

		return combinations;
	}

	// 初始生成一些词语
	generateWords();
});
