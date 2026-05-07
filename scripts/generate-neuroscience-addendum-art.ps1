param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $Root 'assets/lesson-art'
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Color-Hex([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function New-RoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
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
  $path = New-RoundRect $x $y $w $h $r
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-RoundRect($g, $pen, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-RoundRect $x $y $w $h $r
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

function Draw-Arrow($g, $pen, [float]$x1, [float]$y1, [float]$x2, [float]$y2) {
  $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(7, 9)
  $arrowPen = $pen.Clone()
  $arrowPen.CustomEndCap = $cap
  $g.DrawLine($arrowPen, $x1, $y1, $x2, $y2)
  $arrowPen.Dispose()
  $cap.Dispose()
}

function New-Canvas([string]$id, [string]$title, [string]$subtitle) {
  $bitmap = New-Object System.Drawing.Bitmap(1600, 900)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $p = [pscustomobject]@{
    Bg = Color-Hex '#F8F6FF'
    Soft = Color-Hex '#EDE8FF'
    Card = Color-Hex '#FFFFFF'
    Primary = Color-Hex '#4F46E5'
    PrimaryLight = Color-Hex '#A79BF2'
    Green = Color-Hex '#0E9E74'
    Gold = Color-Hex '#F7B500'
    Dark = Color-Hex '#151447'
    Muted = Color-Hex '#5B5781'
    Pink = Color-Hex '#D9468F'
  }
  $f = [pscustomobject]@{
    Id = New-Object System.Drawing.Font('Segoe UI', 46, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Title = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Label = New-Object System.Drawing.Font('Segoe UI', 27, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    Body = New-Object System.Drawing.Font('Segoe UI', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    Small = New-Object System.Drawing.Font('Segoe UI', 19, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  }

  $g.Clear($p.Bg)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Soft)), -160, 630, 760, 260)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Soft)), 870, 620, 860, 280)

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Card)) 1235 70 300 390 34
  Draw-RoundRect $g (New-Object System.Drawing.Pen($p.PrimaryLight, 4)) 1235 70 300 390 34
  Draw-Text $g $id $f.Id (New-Object System.Drawing.SolidBrush($p.Primary)) 1280 105 230 58
  Draw-Text $g $title $f.Title (New-Object System.Drawing.SolidBrush($p.Primary)) 1280 172 220 96
  $g.DrawLine((New-Object System.Drawing.Pen($p.PrimaryLight, 4)), 1280, 278, 1490, 278)
  Draw-Text $g $subtitle $f.Body (New-Object System.Drawing.SolidBrush($p.Muted)) 1280 305 210 115

  return [pscustomobject]@{ Bitmap = $bitmap; Graphics = $g; Palette = $p; Fonts = $f }
}

function Save-Canvas($canvas, [string]$id) {
  $path = Join-Path $outDir ($id + '.png')
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  foreach ($font in $canvas.Fonts.PSObject.Properties.Value) { $font.Dispose() }
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
  Write-Host "Created $path"
}

function Draw-A41 {
  $c = New-Canvas 'A41' 'Synaptic vesicles' 'Fill, dock, fuse, recycle'
  $g = $c.Graphics; $p = $c.Palette; $f = $c.Fonts
  $primary = New-Object System.Drawing.SolidBrush($p.Primary)
  $dark = New-Object System.Drawing.SolidBrush($p.Dark)
  $muted = New-Object System.Drawing.SolidBrush($p.Muted)
  $gold = New-Object System.Drawing.SolidBrush($p.Gold)
  $green = New-Object System.Drawing.SolidBrush($p.Green)
  $border = New-Object System.Drawing.Pen($p.PrimaryLight, 4)

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Card)) 95 165 900 520 34
  Draw-RoundRect $g $border 95 165 900 520 34
  Draw-Text $g 'Presynaptic terminal' $f.Title $dark 140 190 360 44
  $g.DrawArc((New-Object System.Drawing.Pen($p.Primary, 14)), 180, 255, 650, 300, 190, 160)
  $g.DrawLine((New-Object System.Drawing.Pen($p.Primary, 12)), 255, 530, 760, 530)
  Draw-Text $g 'active zone' $f.Label $primary 570 555 210 36 'Center'

  $vesicles = @(@(300, 340), @(420, 300), @(535, 360), @(660, 310), @(455, 450), @(585, 455))
  foreach ($v in $vesicles) {
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Soft)), $v[0], $v[1], 74, 74)
    $g.DrawEllipse((New-Object System.Drawing.Pen($p.Primary, 5)), $v[0], $v[1], 74, 74)
    $g.FillEllipse($gold, $v[0] + 25, $v[1] + 25, 24, 24)
  }
  Draw-Text $g 'filled vesicles' $f.Label $primary 245 610 250 40 'Center'
  Draw-Arrow $g (New-Object System.Drawing.Pen($p.Gold, 8)) 700 385 860 485
  Draw-Text $g 'Ca2+ entry triggers fusion' $f.Label $dark 780 395 310 65

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Card)) 1050 535 405 230 26
  Draw-RoundRect $g $border 1050 535 405 230 26
  Draw-Text $g 'Cycle' $f.Title $dark 1090 560 180 40
  Draw-Text $g '1 fill transmitter' $f.Small $muted 1090 610 310 28
  Draw-Text $g '2 dock and prime' $f.Small $muted 1090 642 310 28
  Draw-Text $g '3 calcium releases' $f.Small $muted 1090 674 310 28
  Draw-Text $g '4 endocytosis recycles' $f.Small $muted 1090 706 330 28

  $g.FillEllipse($green, 910, 490, 26, 26)
  Draw-Text $g 'release probability' $f.Label $dark 615 610 320 40 'Center'
  Save-Canvas $c 'A41'
}

function Draw-A42 {
  $c = New-Canvas 'A42' 'Co-release' 'Fast signal plus slow modulation'
  $g = $c.Graphics; $p = $c.Palette; $f = $c.Fonts
  $primary = New-Object System.Drawing.SolidBrush($p.Primary)
  $dark = New-Object System.Drawing.SolidBrush($p.Dark)
  $muted = New-Object System.Drawing.SolidBrush($p.Muted)
  $gold = New-Object System.Drawing.SolidBrush($p.Gold)
  $pink = New-Object System.Drawing.SolidBrush($p.Pink)
  $border = New-Object System.Drawing.Pen($p.PrimaryLight, 4)

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Card)) 90 155 950 540 34
  Draw-RoundRect $g $border 90 155 950 540 34
  Draw-Text $g 'One axon terminal' $f.Title $dark 135 185 320 44
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Soft)), 245, 295, 250, 200)
  $g.DrawEllipse((New-Object System.Drawing.Pen($p.Primary, 8)), 245, 295, 250, 200)
  foreach ($x in @(300, 370, 430)) {
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Card)), $x, 345, 54, 54)
    $g.DrawEllipse((New-Object System.Drawing.Pen($p.Primary, 4)), $x, 345, 54, 54)
    $g.FillEllipse($gold, $x + 18, 363, 18, 18)
  }
  foreach ($x in @(315, 405)) {
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($p.Card)), $x, 430, 66, 66)
    $g.DrawEllipse((New-Object System.Drawing.Pen($p.Pink, 5)), $x, 430, 66, 66)
    $g.FillEllipse($pink, $x + 22, 452, 22, 22)
  }
  Draw-Text $g 'small clear vesicles' $f.Body $muted 170 525 290 32 'Center'
  Draw-Text $g 'dense-core vesicles' $f.Body $muted 195 560 290 32 'Center'

  Draw-Arrow $g (New-Object System.Drawing.Pen($p.Gold, 9)) 520 365 720 330
  Draw-Arrow $g (New-Object System.Drawing.Pen($p.Pink, 9)) 520 465 720 535

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Soft)) 740 255 250 135 24
  Draw-RoundRect $g $border 740 255 250 135 24
  Draw-Text $g 'fast transmitter' $f.Label $primary 760 285 220 35 'Center'
  Draw-Text $g 'glutamate, GABA, ACh' $f.Small $dark 758 330 224 42 'Center'

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush((Color-Hex '#FCE5EF'))) 740 475 250 145 24
  Draw-RoundRect $g (New-Object System.Drawing.Pen($p.Pink, 4)) 740 475 250 145 24
  Draw-Text $g 'slow modulator' $f.Label $pink 760 505 220 35 'Center'
  Draw-Text $g 'peptide or monoamine' $f.Small $dark 758 550 224 42 'Center'

  Fill-RoundRect $g (New-Object System.Drawing.SolidBrush($p.Card)) 1070 535 405 175 26
  Draw-RoundRect $g $border 1070 535 405 175 26
  Draw-Text $g 'Why it matters' $f.Title $dark 1110 560 260 40
  Draw-Text $g 'One neuron can shape voltage now and circuit state later.' $f.Body $muted 1110 615 320 60

  Save-Canvas $c 'A42'
}

Draw-A41
Draw-A42
