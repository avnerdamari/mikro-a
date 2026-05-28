import katex from 'katex'

interface Props {
  math: string
  display?: boolean
  className?: string
}

export function MathText({ math, display = false, className }: Props) {
  let html = ''
  try {
    html = katex.renderToString(math, {
      throwOnError: false,
      displayMode: display,
    })
  } catch {
    html = math
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
