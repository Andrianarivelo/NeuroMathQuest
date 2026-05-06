param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $Root 'assets/lesson-art'
if (!(Test-Path $assetsDir)) {
  New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

function Color-Hex([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function New-PathRoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundRect($g, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-PathRoundRect $x $y $w $h $r
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-RoundRect($g, $pen, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-PathRoundRect $x $y $w $h $r
  $g.DrawPath($pen, $path)
  $path.Dispose()
}

function Draw-Text($g, [string]$text, $font, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [string]$align = 'Near') {
  $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::$align
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $g.DrawString($text, $font, $brush, $rect, $format)
  $format.Dispose()
}

function Decode-TsString([string]$value) {
  $clean = $value -replace "\\'", "'"
  try {
    return ConvertFrom-Json ('"' + ($clean -replace '"', '\"') + '"')
  } catch {
    return $clean
  }
}

function Shorten([string]$value, [int]$max = 28) {
  $text = ($value -replace '\s+', ' ').Trim()
  if ($text.Length -le $max) { return $text }
  return ($text.Substring(0, [Math]::Min($max - 1, $text.Length)).TrimEnd() + '.')
}

function Read-Lessons {
  $contentDir = Join-Path $Root 'src/content'
  $files = @('trackB.ts', 'trackC.ts', 'trackD.ts', 'trackE.ts')
  $lessons = @()
  $lessonRegex = [regex]::new("(?s)\{\s*id:\s*'(?<id>[BCDE]\d{2})'.*?questions:\s*\[")
  foreach ($file in $files) {
    $raw = Get-Content -Raw -Encoding UTF8 -Path (Join-Path $contentDir $file)
    foreach ($match in $lessonRegex.Matches($raw)) {
      $block = $match.Value
      $id = $match.Groups['id'].Value
      $title = Decode-TsString(([regex]::Match($block, "title:\s*'(?<v>(?:\\'|[^'])*)'")).Groups['v'].Value)
      $subtitle = Decode-TsString(([regex]::Match($block, "subtitle:\s*'(?<v>(?:\\'|[^'])*)'")).Groups['v'].Value)
      $track = ([regex]::Match($block, "trackId:\s*'(?<v>[^']+)'")).Groups['v'].Value
      $notationMatch = [regex]::Match($block, "notation:\s*'(?<v>(?:\\'|[^'])*)'")
      $notation = if ($notationMatch.Success) { Decode-TsString($notationMatch.Groups['v'].Value) } else { '' }
      $termsMatch = [regex]::Match($block, "(?s)keyTerms:\s*\[(?<v>.*?)\]")
      $terms = @()
      if ($termsMatch.Success) {
        foreach ($termMatch in [regex]::Matches($termsMatch.Groups['v'].Value, "'(?<v>(?:\\'|[^'])*)'")) {
          $terms += Decode-TsString($termMatch.Groups['v'].Value)
        }
      }
      if ($terms.Count -eq 0) {
        $terms = @($title, $subtitle, 'practice')
      }
      $lessons += [pscustomobject]@{
        Id = $id
        Track = $track
        Title = $title
        Subtitle = $subtitle
        Terms = $terms
        Notation = $notation
      }
    }
  }
  return $lessons
}

function Draw-Arrow($g, $pen, [float]$x1, [float]$y1, [float]$x2, [float]$y2) {
  $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(7, 9)
  $arrowPen = $pen.Clone()
  $arrowPen.CustomEndCap = $cap
  $g.DrawLine($arrowPen, $x1, $y1, $x2, $y2)
  $arrowPen.Dispose()
  $cap.Dispose()
}

function Draw-MathScene($g, $palette, $fonts, $lesson) {
  $pen = New-Object System.Drawing.Pen($palette.Primary, 8)
  $thin = New-Object System.Drawing.Pen($palette.Primary, 4)
  Draw-Arrow $g $pen 130 610 620 610
  Draw-Arrow $g $pen 180 720 180 250
  $curve = New-Object System.Drawing.Drawing2D.GraphicsPath
  $curve.AddBezier(200, 590, 300, 390, 430, 380, 590, 260)
  $g.DrawPath((New-Object System.Drawing.Pen($palette.Gold, 12)), $curve)
  $curve.Dispose()
  for ($i = 0; $i -lt 4; $i++) {
    $x = 320 + $i * 70
    $y = 540 - $i * 55
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($palette.Gold)), $x, $y, 28, 28)
  }
  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($palette.Soft)) 650 255 320 265 28
  Draw-RoundRect $g $thin 650 255 320 265 28
  for ($r = 0; $r -lt 3; $r++) {
    for ($c = 0; $c -lt 3; $c++) {
      $x = 695 + $c * 78
      $y = 302 + $r * 58
      Fill-RoundRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 248, 255))) $x $y 56 38 10
      Draw-Text $g ([string](($r + 1) * ($c + 1))) $fonts.Small (New-Object System.Drawing.SolidBrush($palette.Dark)) $x ($y + 7) 56 26 'Center'
    }
  }
}

function Draw-CompScene($g, $palette, $fonts, $lesson) {
  $pen = New-Object System.Drawing.Pen($palette.Primary, 9)
  $thin = New-Object System.Drawing.Pen($palette.Primary, 4)
  $somaBrush = New-Object System.Drawing.SolidBrush($palette.Primary)
  $g.FillEllipse($somaBrush, 245, 355, 160, 160)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($palette.Soft)), 295, 405, 60, 60)
  for ($i = 0; $i -lt 6; $i++) {
    $angle = ($i * 55 - 40) * [Math]::PI / 180
    $x2 = 325 + [Math]::Cos($angle) * 240
    $y2 = 435 + [Math]::Sin($angle) * 180
    $g.DrawLine($pen, 325, 435, $x2, $y2)
    $g.DrawLine((New-Object System.Drawing.Pen($palette.PrimaryLight, 5)), $x2, $y2, $x2 + [Math]::Cos($angle) * 80, $y2 + [Math]::Sin($angle) * 70)
  }
  Draw-Arrow $g (New-Object System.Drawing.Pen($palette.Gold, 10)) 410 435 760 435
  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($palette.Soft)) 760 320 330 230 28
  Draw-RoundRect $g $thin 760 320 330 230 28
  Draw-Text $g 'model' $fonts.Label (New-Object System.Drawing.SolidBrush($palette.Primary)) 795 350 270 40 'Center'
  $modelText = if ($lesson.Notation) { Shorten $lesson.Notation 36 } else { 'state -> prediction' }
  Draw-Text $g $modelText $fonts.Small (New-Object System.Drawing.SolidBrush($palette.Dark)) 795 410 270 80 'Center'
}

function Draw-AIScene($g, $palette, $fonts, $lesson) {
  $thin = New-Object System.Drawing.Pen($palette.Primary, 4)
  $xs = @(140, 390, 660, 910)
  $labels = @('data', 'model', 'loss', 'output')
  for ($i = 0; $i -lt $xs.Count; $i++) {
    Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($palette.Soft)) $xs[$i] 365 170 130 26
    Draw-RoundRect $g $thin $xs[$i] 365 170 130 26
    Draw-Text $g $labels[$i] $fonts.Label (New-Object System.Drawing.SolidBrush($palette.Primary)) ($xs[$i] + 20) 410 130 40 'Center'
    if ($i -lt $xs.Count - 1) {
      Draw-Arrow $g (New-Object System.Drawing.Pen($palette.Gold, 8)) ($xs[$i] + 178) 430 ($xs[$i + 1] - 8) 430
    }
  }
  $loopPen = New-Object System.Drawing.Pen($palette.Secondary, 5)
  $g.DrawArc($loopPen, 380, 230, 430, 300, 20, 145)
  Draw-Arrow $g $loopPen 785 288 420 288
  for ($i = 0; $i -lt 18; $i++) {
    $x = 165 + (($i * 31) % 120)
    $y = 390 + (($i * 47) % 70)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($palette.Gold)), $x, $y, 13, 13)
  }
}

function Draw-NeuroAIScene($g, $palette, $fonts, $lesson) {
  $pen = New-Object System.Drawing.Pen($palette.Primary, 8)
  $thin = New-Object System.Drawing.Pen($palette.Primary, 4)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($palette.Soft)), 170, 310, 250, 210)
  $g.DrawBezier($pen, 205, 420, 250, 290, 360, 310, 385, 430)
  $g.DrawBezier($pen, 205, 420, 260, 540, 360, 520, 385, 430)
  for ($i = 0; $i -lt 10; $i++) {
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($palette.Gold)), 215 + (($i * 37) % 150), 340 + (($i * 53) % 130), 20, 20)
  }
  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($palette.Soft)) 760 305 260 220 32
  Draw-RoundRect $g $thin 760 305 260 220 32
  for ($r = 0; $r -lt 4; $r++) {
    $g.DrawLine($thin, 795, 340 + $r * 42, 985, 340 + $r * 42)
  }
  for ($c = 0; $c -lt 4; $c++) {
    $g.DrawLine($thin, 805 + $c * 48, 325, 805 + $c * 48, 500)
  }
  Draw-Arrow $g (New-Object System.Drawing.Pen($palette.Gold, 10)) 440 415 735 415
  Draw-Text $g 'brain data' $fonts.Label (New-Object System.Drawing.SolidBrush($palette.Primary)) 190 545 210 38 'Center'
  Draw-Text $g 'AI model' $fonts.Label (New-Object System.Drawing.SolidBrush($palette.Primary)) 780 545 220 38 'Center'
}

function Draw-LessonArt($lesson) {
  $width = 1600
  $height = 900
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $palette = [pscustomobject]@{
    Bg = Color-Hex '#F8F6FF'
    Soft = Color-Hex '#EFEAFC'
    Card = Color-Hex '#FFFFFF'
    Primary = Color-Hex '#4F46E5'
    PrimaryLight = Color-Hex '#A79BF2'
    Secondary = Color-Hex '#0E9E74'
    Gold = Color-Hex '#F7B500'
    Dark = Color-Hex '#151447'
    Muted = Color-Hex '#5B5781'
  }
  if ($lesson.Track -eq 'math') {
    $palette.Primary = Color-Hex '#0C8661'
    $palette.PrimaryLight = Color-Hex '#8FE0C5'
    $palette.Soft = Color-Hex '#E6F8F2'
  } elseif ($lesson.Track -eq 'aibasis') {
    $palette.Primary = Color-Hex '#1F6FEB'
    $palette.PrimaryLight = Color-Hex '#A7C7FF'
    $palette.Soft = Color-Hex '#E1ECFD'
  } elseif ($lesson.Track -eq 'aineuro') {
    $palette.Primary = Color-Hex '#B82A6E'
    $palette.PrimaryLight = Color-Hex '#F58FB8'
    $palette.Soft = Color-Hex '#FCE5EF'
  } elseif ($lesson.Track -eq 'compneuro') {
    $palette.Primary = Color-Hex '#8A5A00'
    $palette.PrimaryLight = Color-Hex '#FFD866'
    $palette.Soft = Color-Hex '#FFF4DA'
  }

  $fonts = [pscustomobject]@{
    Id = New-Object System.Drawing.Font('Segoe UI', 46, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Title = New-Object System.Drawing.Font('Segoe UI', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Label = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Body = New-Object System.Drawing.Font('Segoe UI', 23, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    Small = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  }

  $g.Clear($palette.Bg)
  $bgBrush = New-Object System.Drawing.SolidBrush($palette.Soft)
  $g.FillEllipse($bgBrush, -180, 610, 680, 230)
  $g.FillEllipse($bgBrush, 850, 650, 920, 260)

  if ($lesson.Track -eq 'math') {
    Draw-MathScene $g $palette $fonts $lesson
  } elseif ($lesson.Track -eq 'compneuro') {
    Draw-CompScene $g $palette $fonts $lesson
  } elseif ($lesson.Track -eq 'aibasis') {
    Draw-AIScene $g $palette $fonts $lesson
  } else {
    Draw-NeuroAIScene $g $palette $fonts $lesson
  }

  $darkBrush = New-Object System.Drawing.SolidBrush($palette.Dark)
  $mutedBrush = New-Object System.Drawing.SolidBrush($palette.Muted)
  $primaryBrush = New-Object System.Drawing.SolidBrush($palette.Primary)
  $cardBrush = New-Object System.Drawing.SolidBrush($palette.Card)
  $goldBrush = New-Object System.Drawing.SolidBrush($palette.Gold)
  $borderPen = New-Object System.Drawing.Pen($palette.PrimaryLight, 4)

  Fill-RoundRect $g $cardBrush 1245 70 295 415 34
  Draw-RoundRect $g $borderPen 1245 70 295 415 34
  Draw-Text $g $lesson.Id $fonts.Id $primaryBrush 1290 105 230 58 'Near'
  Draw-Text $g $lesson.Title $fonts.Title $primaryBrush 1290 170 220 72 'Near'
  $g.DrawLine($borderPen, 1290, 250, 1490, 250)

  $terms = @($lesson.Terms | Select-Object -First 3)
  for ($i = 0; $i -lt $terms.Count; $i++) {
    $y = 285 + $i * 62
    $g.FillEllipse($goldBrush, 1292, $y, 26, 26)
    Draw-Text $g (Shorten $terms[$i] 18) $fonts.Small $darkBrush 1330 ($y - 4) 180 30 'Near'
    Draw-Text $g 'lesson concept' $fonts.Small $mutedBrush 1330 ($y + 22) 180 28 'Near'
  }

  $calloutPositions = @(
    @(70, 150, 345, 325),
    @(115, 600, 345, 535),
    @(715, 110, 650, 320)
  )
  for ($i = 0; $i -lt $terms.Count; $i++) {
    $p = $calloutPositions[$i]
    Fill-RoundRect $g $cardBrush $p[0] $p[1] 230 62 18
    Draw-RoundRect $g $borderPen $p[0] $p[1] 230 62 18
    Draw-Text $g (Shorten $terms[$i] 20) $fonts.Label $primaryBrush ($p[0] + 12) ($p[1] + 14) 205 34 'Center'
    $g.DrawLine((New-Object System.Drawing.Pen($palette.Primary, 4)), ($p[0] + 230), ($p[1] + 32), $p[2], $p[3])
    $g.FillEllipse($primaryBrush, $p[2] - 8, $p[3] - 8, 16, 16)
  }

  Fill-RoundRect $g $cardBrush 90 690 610 150 24
  Draw-RoundRect $g $borderPen 90 690 610 150 24
  Draw-Text $g 'Lesson flow' $fonts.Title $darkBrush 130 714 220 42 'Near'
  $flowTerms = @($terms + @('practice', 'quiz')) | Select-Object -First 3
  for ($i = 0; $i -lt 3; $i++) {
    $x = 145 + $i * 170
    $g.FillEllipse($primaryBrush, $x, 770, 36, 36)
    Draw-Text $g ([string]($i + 1)) $fonts.Small (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) ($x + 2) 775 32 26 'Center'
    Draw-Text $g (Shorten $flowTerms[$i] 16) $fonts.Small $darkBrush ($x - 45) 812 130 26 'Center'
    if ($i -lt 2) { Draw-Arrow $g (New-Object System.Drawing.Pen($palette.Secondary, 5)) ($x + 50) 788 ($x + 145) 788 }
  }

  if ($lesson.Notation) {
    Fill-RoundRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 245, 255))) 760 700 390 110 20
    Draw-RoundRect $g (New-Object System.Drawing.Pen($palette.PrimaryLight, 3)) 760 700 390 110 20
    Draw-Text $g 'notation' $fonts.Small $mutedBrush 790 715 130 24 'Near'
    Draw-Text $g (Shorten $lesson.Notation 42) $fonts.Label $darkBrush 790 745 320 40 'Near'
  }

  $outPath = Join-Path $assetsDir ($lesson.Id + '.png')
  $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bitmap.Dispose()
  foreach ($font in $fonts.PSObject.Properties.Value) { $font.Dispose() }
  Write-Host "Created $outPath"
}

$lessons = Read-Lessons
foreach ($lesson in $lessons) {
  Draw-LessonArt $lesson
}

Write-Host "Generated $($lessons.Count) non-neuroscience lesson diagrams."
