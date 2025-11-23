# POC PDF writter JS

## Goals

1. Generate pdf from html template
1. Generate pdf from docx template
1. Convert docx to pdf
1. fully working on docker ubi8 and any other linux image

## Prerequisite

1. git
1. vscode
1. docker

## Get Started

1. Clone the repository
1. Open the project with vscode
1. Open terminal then type `docker compose up --build`

## Example Request

generate from url site http://example.com transform to pdf

```
curl 'http://localhost:8080/pdf'
```

generate downloadable file docx filled with data object on `exampleService.loopTableData()`

```
curl 'http://localhost:8080/docx'
```

generate file docx filled with data object on `exampleService.loopTableData()` and convert to pdf file placed on output directory

```
curl 'http://localhost:8080/docx-to-pdf'
```

generate html with template engine with nunjucks filled with data object on `exampleService.exampleWithNestedObjectData()`

```
curl 'http://localhost:8080/njk'
```

generate pdf from html with template engine with nunjucks filled with data object on `exampleService.exampleWithNestedObjectData()` printed as pdf

```
curl 'http://localhost:8080/njk-to-pdf'
```
