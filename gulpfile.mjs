import gulp from "gulp";
import ts from "gulp-typescript";
import sourcemaps from "gulp-sourcemaps";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

const tsProject = ts.createProject('tsconfig.json');
const sass = gulpSass(dartSass);

const sourceFiles = [
	'src/city-of-mist/fonts/**/*',
	'src/city-of-mist/images/**/*',
	'src/city-of-mist/lang/**/*',
	'src/city-of-mist/sounds/**/*',
	'src/city-of-mist/**/*.hbs',
	'src/city-of-mist/**/*.html',
	'src/city-of-mist/system.json',
	'src/city-of-mist/template.json'
];

const projectFiles = [
	'README.md'
];

export function scripts() {
    return gulp.src(['foundrytypes/**/*.ts', 'src/city-of-mist/module/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/city-of-mist/module'));
}

export function styles() {
	return gulp.src(['src/city-of-mist/**/*.scss'], { base: 'src/city-of-mist' })
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass({
			outputStyle: 'compressed',
			silenceDeprecations: ['legacy-js-api', 'import'],
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/city-of-mist'));
}

function copySourceFiles() {
	return gulp.src(sourceFiles, { base: 'src/city-of-mist', encoding: false })
		.pipe(gulp.dest('dist/city-of-mist'));
}
function copyProjectFiles() {
	return gulp.src(projectFiles, { base: '.' })
		.pipe(gulp.dest('dist'));
}
const copyFiles = gulp.series(copySourceFiles, copyProjectFiles);

export async function buildPacks(cb) {
	await compilePack('src/city-of-mist/packs/macro', 'dist/city-of-mist/packs/macro');
	await compilePack('src/city-of-mist/packs/sampledangers', 'dist/city-of-mist/packs/sampledangers');
	await compilePack('src/city-of-mist/packs/themebooks', 'dist/city-of-mist/packs/themebooks');
	cb();
}

export function watch() {
    gulp.watch('src/city-of-mist/module/**/*.ts', scripts);
    gulp.watch('src/city-of-mist/**/*.scss', styles);
	gulp.watch(
		sourceFiles,
		{ ignoreInitial: false },
		copyProjectFiles,
	);
}

export const build = gulp.series(scripts, styles, copyFiles, buildPacks);
